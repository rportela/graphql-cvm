import { stat } from "fs";
import { resolve } from "path";
import { RawDataStorage } from "../interfaces/RawDataStorage";


export class LocalRawStorage extends RawDataStorage {

    constructor(source: string, dataset: string) {
        super(source, dataset);
    }

    getFileName(resource: string): string {
        return resolve(".data/raw/", this.source, this.dataset, resource);
    }

    getResourceDate(resource: string): Promise<Date> {
        return new Promise((resolve, reject) => {
            stat(this.getFileName(resource), (error, data) => {
                if (error) reject(error);
                else resolve(data.mtime);
            })
        })
    }
    download(url: string, target?: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}