import { existsSync } from "fs";
import { CkanResource } from "../types";
import { CkanApi } from "../services/CkanApi";
import { DataFolder } from "./DataFolder";

const LOCAL_PATH = ".data/raw";

/**
 * This class makes a local cache of ckan resources.
 */
export class CkanLocalCache extends DataFolder {
  ckan_api: CkanApi;
  file_format?: string;

  /**
   *
   * @param config
   */
  constructor(
    api_url: string,
    package_id: string,
    file_format?: string,
    gzip?: boolean
  ) {
    super(package_id, gzip, LOCAL_PATH);
    this.ckan_api = new CkanApi(api_url);
    this.file_format = file_format;
  }

  /**
   *
   * @returns
   */
  getResources = async (): Promise<CkanResource[]> => {
    const pkg = await this.ckan_api.getPackage(this.name);
    let resources = pkg.resources;
    if (this.file_format)
      resources = resources.filter((r) => r.format === this.file_format);
    return resources;
  };

  /**
   *
   * @param resource
   * @returns
   */
  getLocalPath(resource: CkanResource): string {
    const lindex = resource.url.lastIndexOf("/");
    let fileName = lindex > 0 ? resource.url.substr(lindex + 1) : resource.url;
    return this.getFilePath(fileName);
  }

  /**
   *
   * @param resource
   * @returns
   */
  checkIfNewer(resource: CkanResource): boolean {
    const local = this.getLocalPath(resource);
    if (!existsSync(local)) return true;
    const resTime = new Date(resource.created || resource.last_modified);
    const stats = this.getStats(this.getLocalPath(resource));
    return resTime.getTime() > stats.mtimeMs;
  }

  /**
   *
   * @param resource
   * @returns
   */
  synchronizeResource = async (resource: CkanResource): Promise<void> => {
    if (this.checkIfNewer(resource)) {
      await this.download(resource.url);
    }
  };

  /**
   *
   * @returns
   */
  async synchronize(): Promise<void[]> {
    const resources = await this.getResources();
    return Promise.all(resources.map(this.synchronizeResource));
  }
}