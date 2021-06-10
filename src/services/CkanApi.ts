import fetch from "node-fetch";

export interface CkanPackageInfo {}

export class CkanApi {
  url: string;

  constructor(url: string) {
    this.url = url.endsWith("/") ? url : url + "/";
  }

  get(action: string): Promise<any> {
    return fetch(action)
      .then((res) => res.json())
      .then((json) => json.result);
  }

  listPackages(): Promise<string[]> {
    return this.get("package_list");
  }

  listGroups(): Promise<string[]> {
    return this.get("group_list");
  }

  listTags(): Promise<string[]> {
    return this.get("tag_list");
  }
}
