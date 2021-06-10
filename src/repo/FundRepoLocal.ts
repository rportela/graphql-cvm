import path from "path";
import { Fundo } from "../entities/Fundo";
import { fileExists, jsonGunzip, jsonGzip } from "../utils/FileSystem";
import { FundRepo } from "./FundRepo";

const LOCAL_PATH = "../.data/fundos";
export class FundoRepoLocal implements FundRepo {
  getLocalFile(cnpj: number) {
    return path.resolve(LOCAL_PATH, cnpj + ".json.gz");
  }
  readFund(cnpj: number): Promise<Fundo> {
    const localfile = this.getLocalFile(cnpj);
    return fileExists(localfile).then(() => jsonGunzip(localfile));
  }
  saveFund(fund: Fundo): Promise<void> {
    const localFile = this.getLocalFile(fund.cnpj);
    return jsonGzip(localFile, JSON.stringify(fund));
  }
}
