import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { FundoCompleto } from "../types/FundoCompleto";
import { FundoCompletoRepo } from "./FundoCompletoRepo";

const REPO_PATH = "./.data/entities/fundos";

export class FundoCompletoRepoLocal implements FundoCompletoRepo {
  async save(completo: FundoCompleto): Promise<void> {
    const content = JSON.stringify(completo);
    const fileName = resolve(REPO_PATH, `${completo.cadastro.cnpj}.json`);
    await writeFile(fileName, content);
  }

  async load(cnpj: number): Promise<FundoCompleto | undefined> {
    const fileName = resolve(REPO_PATH, `${cnpj}.json`);
    try {
      if (!existsSync(fileName)) return undefined;
      const buff = await readFile(fileName);
      const content = buff.toString();
      return JSON.parse(content);
    } catch (err) {
      console.error(fileName);
      throw err;
    }
  }

  async update(
    cnpj: number,
    updateFunction: (cad: FundoCompleto) => void
  ): Promise<boolean> {
    const fundo = await this.load(cnpj);
    if (!fundo) return false;
    updateFunction(fundo);
    await this.save(fundo);
    return true;
  }
}
