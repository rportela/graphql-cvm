import { CkanResource } from "../types";
import { CkanLocalCache } from "./CkanLocalCache";

export class FundoCarteiraRepoLocal {
  cache = new CkanLocalCache(
    "http://dados.cvm.gov.br",
    "fi-doc-cda",
    "ZIP",
    false
  );

  async syncronize(): Promise<CkanResource[]> {
    return this.cache.synchronize();
  }

  getFilePath(year: number, month: number): string {
    const fn = `cda_fi_${year}${("00" + month).substr(-2)}.zip`;
    return this.cache.getFilePath(fn);
  }
}
