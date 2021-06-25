import { Bucket, Storage } from "@google-cloud/storage";

const storage = new Storage();
const BUCKET_NAME = "ports-datalake";


export class PortsDatalake {
    source: string;
    dataset: string;
    resource: string;
    private _bucket: Bucket;
    private _blobName: string;

    constructor(source: string, dataset: string, resource: string) {
        this.source = source;
        this.dataset = dataset;
        this.resource = resource;
        this._bucket = storage.bucket(BUCKET_NAME);
        this._blobName = this.source + "/" + this.dataset + "/" + this.resource;
    }

    async uploadFile(fileName: string, gzip?: boolean) {
        await this._bucket.upload(fileName, { destination: this._blobName, gzip: gzip })
    }

}

