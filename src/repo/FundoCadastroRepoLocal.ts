import { CkanResource } from "../types";
import { FundoCadastro } from "../types/FundoCadastro";
import { CkanLocalCache } from "./CkanLocalCache";
import { CsvVisitor, DataFolder } from "./DataFolder";
import { FundoCadastroCsvBuilder } from "../builders/FundoCadastroCsvBuilder";
import { FundoCadastroRepo } from "./FundoCadastroRepo";

export class FundoCadastroRepoLocal implements FundoCadastroRepo {

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
    return await this.ckanCache.forEachCsvRow("cad_fi.csv", ";", csvConsumer);
  }

  ckanCache = new CkanLocalCache(
    "http://dados.cvm.gov.br",
    "fi-cad",
    "CSV",
    true,
    "latin1"
  );

  localCache = new DataFolder("fi-cad", true, "./data/entities/cvm");

  updateLocal(cnpj: string | number, data: FundoCadastro){
    return write
  }
}
