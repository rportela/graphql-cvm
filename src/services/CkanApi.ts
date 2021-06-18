import fetch from "node-fetch";
import { CkanPackage } from "../types";

/**
 *
 * https://docs.ckan.org/en/2.9/api/#module-ckan.logic.action.get
 *
 */
export class CkanApi {
  url: string;
  constructor(urlBase: string) {
    if (!urlBase.endsWith("/")) urlBase += "/";
    this.url = urlBase + "api/3/action/";
  }

  /**
   *
   * @param action
   * @returns
   */
  get<T>(action: string): Promise<T> {
    return fetch(this.url + action)
      .then((res) => res.json())
      .then((json) => json.result);
  }

  /**
   * Helper to check if the API is up and running.
   *
   * @returns
   */
  siteRead(): Promise<boolean> {
    return this.get("site_read");
  }

  /**
   * Return a list of the names of the site’s datasets (packages).
   *
   * @returns list of strings
   */
  listPackages(): Promise<string[]> {
    return this.get("package_list");
  }

  /**
   * Return a list of the site’s datasets (packages) and their resources.
   * The list is sorted most-recently-modified first.
   *
   * @returns list of dictionaries
   */
  currentPackagesAndResources(): Promise<any[]> {
    return this.get("current_package_list_with_resources");
  }

  /**
   * Return the members of a group.
   * The user must have permission to ‘get’ the group.
   *
   * @param id (string) – the id or name of the group
   */
  listMembers(id: string): Promise<any[]> {
    return this.get("member_list?id=" + encodeURIComponent(id));
  }

  /**
   *
   * @returns
   */
  listTags(): Promise<string[]> {
    return this.get("tag_list");
  }

  listGroups(): Promise<string[]> {
    return this.get("group_list");
  }

  getPackage(id: string): Promise<CkanPackage> {
    return this.get("package_show?id=" + encodeURIComponent(id));
  }
}
