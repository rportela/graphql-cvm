import { existsSync, mkdirSync, statSync } from "fs";
import { resolve } from "path";
import { CkanResource } from "../types";
import { download, readJsonFile, writeJsonFile } from "../utils/Files";
import { CkanApi } from "./CkanApi";

const RAW_ROOT = './.data/raw';
const ENTITIES_ROOT = './.data/entities';



export interface EntityConsumer<T> {
    (entity: T);
}

export interface EntityProducer<T> {
    (fileName: string, gzip: boolean, consumer: EntityConsumer<T>): Promise<void>
}

export interface EntityTransformer<T> {
    (service: CkanSyncService<T>, key: string, data: T[]): Promise<void>
}

export class CkanSyncService<T> {

    organization: string;
    ckan_url: string;
    package_id: string;
    gzip: boolean;
    entity_key: string;
    file_format: string;
    path_raw: string;
    path_entities: string;
    producer: EntityProducer<T>;
    transformer: EntityTransformer<T>;

    constructor(organization: string, ckan_url: string, package_id: string, file_format: string, gzip: boolean, entity_key: string, producer: EntityProducer<T>, transformer: EntityTransformer<T>) {
        this.organization = organization;
        this.ckan_url = ckan_url;
        this.package_id = package_id;
        this.file_format = file_format;
        this.gzip = gzip;
        this.entity_key = entity_key;
        this.path_raw = resolve(RAW_ROOT, organization, package_id);
        this.path_entities = resolve(ENTITIES_ROOT, organization, package_id);
        this.producer = producer;
        this.transformer = transformer;
        if (!existsSync(this.path_raw)) mkdirSync(this.path_raw, { recursive: true });
        if (!existsSync(this.path_entities)) mkdirSync(this.path_entities, { recursive: true });
    }

    getLocalEntityFile(key: string) {
        const fileName = `${key}.json.gz`;
        return resolve(this.path_entities, fileName);
    }

    async getLocalEntity(key: string): Promise<T[]> {
        return await readJsonFile(this.getLocalEntityFile(key), true);
    }

    async setLocalEntity(key: string, entity: T[]) {
        await writeJsonFile(entity, this.getLocalEntityFile(key), true);
    }

    getLocalFileName(resource: CkanResource): string {
        const lindex = resource.url.lastIndexOf("/");
        let fileName = lindex > 0 ? resource.url.substr(lindex + 1) : resource.url;
        if (this.gzip) fileName += ".gz";
        return resolve(this.path_raw, fileName);
    }

    checkIfNewer(localFile: string, checkDate: Date): boolean {
        if (!existsSync(localFile)) return true;
        const stat = statSync(localFile);
        return checkDate > stat.mtime;
    }

    async extract(): Promise<string[]> {
        const start_date = new Date();
        console.log("Extracting...", start_date);
        const pkg = await new CkanApi(this.ckan_url).getPackage(this.package_id);
        const updated: string[] = [];
        for (const resource of pkg.resources) {
            if (resource.format === this.file_format) {
                const localFile = this.getLocalFileName(resource);
                const resDate = new Date(resource.last_modified || resource.created);
                if (this.checkIfNewer(localFile, resDate)) {
                    await download(resource.url, localFile, this.gzip);
                    updated.push(localFile);
                }
            }
        }
        console.log("Extract completed, took", (new Date().getTime() - start_date.getTime()) / 1000.0, "segs.")
        return updated;
    }

    async createSyncObject(localFile: string): Promise<Record<string, T[]>> {
        const syncObject: Record<string, T[]> = {};
        const consumer: EntityConsumer<T> = (entry: T) => {
            const key = entry[this.entity_key];
            let arr: T[] = syncObject[key];
            if (!arr) {
                arr = [];
                syncObject[key] = arr;
            }
            arr.push(entry);
        }
        await this.producer(localFile, this.gzip, consumer);
        return syncObject;
    }

    async transformFile(localFile: string) {
        const start_date = new Date();
        console.log("Transforming...", localFile, start_date);
        const syncObject = await this.createSyncObject(localFile);
        const keys = Object.keys(syncObject);
        for (const key of keys) {
            await this.transformer(this, key, syncObject[key]);
        }
        console.log("Transform completed, took", (new Date().getTime() - start_date.getTime()) / 1000.0, "segs.")
    }


    async synchronize() {
        const start_date = new Date();
        console.log("Sync start for", this.organization, this.package_id, start_date);
        const changes = await this.extract();
        for (const file of changes) {
            await this.transformFile(file);
        }
    }

}