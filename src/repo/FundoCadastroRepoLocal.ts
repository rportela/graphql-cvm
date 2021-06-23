import { mkdirSync, ReadStream } from "fs";
import { resolve } from "path";
import { FundoCadastroCsvBuilder } from "../builders/FundoCadastroCsvBuilder";
import { CkanResource } from "../types";
import { FundoCadastro } from "../types/FundoCadastro";
import { forEachCsvRow, readJsonFile, writeJsonFile } from "../utils/Files";
import { CkanLocalCache } from "./CkanLocalCache";
import { CsvVisitor } from "./DataFolder";
import { FundoCadastroRepo } from "./FundoCadastroRepo";

export class FundoCadastroRepoLocal implements FundoCadastroRepo {

  constructor() {
    mkdirSync(resolve("./.data/entities/cvm/fi-cad"), { recursive: true });
  }

  async fundoBusca(filter: string): Promise<FundoCadastro[]> {
    const fundos = [];
    const regex = new RegExp(filter, "ig");
    const addFundo = (fundo: FundoCadastro) => {
      if (regex.test(fundo.razao_social)) fundos.push(fundo);
      return true;
    };
    await this.forEachFundoCadastro(addFundo);
    return fundos;
  }

  async todosOsFundos(): Promise<FundoCadastro[]> {
    const fundos = [];
    const addFundo = (fundo: FundoCadastro) => {
      fundos.push(fundo);
      return true;
    };
    await this.forEachFundoCadastro(addFundo);
    return fundos;
  }

  async fundosEmOperacao(): Promise<FundoCadastro[]> {
    return (await this.todosOsFundos()).filter(
      (fundo) => fundo.situacao === "EM FUNCIONAMENTO NORMAL"
    );
  }

  async syncronize(): Promise<CkanResource[]> {
    return this.ckanCache.synchronize();
  }

  async forEachFundoCadastro(
    consumer: (cad: FundoCadastro) => boolean
  ): Promise<number> {
    const builder = new FundoCadastroCsvBuilder();
    const csvConsumer: CsvVisitor = (
      row: string[],
      _line_number: number,
      headers: string[]
    ) => {
      const fd = builder.build(row, headers);
      return consumer(fd);
    };
    return await forEachCsvRow(this.ckanCache.getReadStream('cad_fi.csv.gz') as ReadStream, ";", csvConsumer);
  }

  ckanCache = new CkanLocalCache(
    "cvm",
    "http://dados.cvm.gov.br",
    "fi-cad",
    "CSV",
    true,
    "latin1"
  );

  async updateCadastro(cnpj: string | number, data: FundoCadastro[]) {
    return await writeJsonFile(data, `./.data/entities/cvm/fi-cad/${cnpj}.json.gz`, true);
  }

  async readCadastro(cnpj: string | number): Promise<FundoCadastro[]> {
    return await readJsonFile(`./data/entities/cvm/fi-cad/${cnpj}.json.gz`, true);
  }


}
