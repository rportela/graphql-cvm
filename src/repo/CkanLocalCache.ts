import { createWriteStream, existsSync, mkdirSync, stat } from "fs";
import { get } from "http";
import { resolve } from "path";
import { createGzip } from "zlib";
import { CkanResource } from "../entities";
import { CkanApi } from "../services/CkanApi";
import { CsvConsumer, parseCsv } from "./TextRepo";

const LOCAL_PATH = ".data/raw";

/**
 *
 */
export interface CkanLocalCacheConfig {
  package_id: string;
  api_url: string;
  file_format: string;
  gzip?: boolean;
}

/**
 *
 */
export class CkanLocalCache {
  config: CkanLocalCacheConfig;

  /**
   *
   * @param config
   */
  constructor(config: CkanLocalCacheConfig) {
    if (!config)
      throw new Error("A configuration is required for CKAN local cache.");
    this.config = config;
  }

  /**
   *
   * @returns
   */
  getResources = (): Promise<CkanResource[]> => {
    const resources = new CkanApi(this.config.api_url)
      .getPackage(this.config.package_id)
      .then((pkg) => pkg.resources);
    return this.config.file_format
      ? resources.then((res) =>
          res.filter((r) => r.format === this.config.file_format)
        )
      : resources;
  };

  /**
   *
   * @param fileName
   * @returns
   */
  getFilePath = (fileName: string): string => {
    return resolve(LOCAL_PATH, this.config.package_id, fileName);
  };

  /**
   *
   * @param resource
   * @returns
   */
  getLocalPath = (resource: CkanResource): string => {
    const lindex = resource.url.lastIndexOf("/");
    let fileName = lindex > 0 ? resource.url.substr(lindex + 1) : resource.url;
    if (this.config.gzip === true) fileName += ".gz";
    return this.getFilePath(fileName);
  };

  /**
   *
   * @param resource
   * @returns
   */
  checkIfNewer = (resource: CkanResource): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const localPath = this.getLocalPath(resource);
      if (!existsSync(localPath)) return resolve(true);
      stat(localPath, (err, stat) => {
        if (err) {
          reject(err);
        } else {
          const res_date = resource.last_modified || resource.created;
          resolve(new Date(res_date).getTime() > stat.mtimeMs);
        }
      });
    });
  };

  /**
   *
   * @param resource
   * @returns
   */
  async saveResource(resource: CkanResource): Promise<void> {
    return new Promise((resolve, reject) => {
      const remote = resource.url;
      const local = this.getLocalPath(resource);
      console.log("donwloading", remote, "->", local);
      const file = createWriteStream(local);
      const do_gzip = this.config.gzip;
      get(remote, function (response) {
        const w = do_gzip
          ? response.pipe(createGzip()).pipe(file)
          : response.pipe(file);
        w.on("close", resolve);
        w.on("error", reject);
      });
    });
  }

  /**
   *
   * @param resource
   * @returns
   */
  synchronizeResource = (resource: CkanResource): Promise<void> => {
    return this.checkIfNewer(resource).then((newer) =>
      newer ? this.saveResource(resource) : Promise.resolve()
    );
  };

  ensureLocalFolder() {
    const localdir = resolve(LOCAL_PATH, this.config.package_id);
    if (!existsSync(localdir)) mkdirSync(localdir);
  }

  /**
   *
   * @returns
   */
  synchronize = (): Promise<void[]> => {
    this.ensureLocalFolder();
    return this.getResources().then((res) =>
      Promise.all(res.map(this.synchronizeResource))
    );
  };

  async forEachOnCsvFile(
    fileName: string,
    consumer: CsvConsumer
  ): Promise<number> {
    const localFile = this.getFilePath(
      this.config.gzip === true && !fileName.endsWith(".gz")
        ? fileName + ".gz"
        : fileName
    );
    if (!existsSync(localFile)) return 0;
    return await parseCsv(localFile, consumer, ";", true, this.config.gzip);
  }
}
