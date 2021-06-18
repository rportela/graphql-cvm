import { Fundo } from "../types/Fundo";
import { CkanLocalCache } from "./CkanLocalCache";
import { CsvVisitor } from "./DataFolder";
import { FundoCadastroCsvBuilder } from "./FundoCadastroCsvBuilder";
import { FundoCadastroRepo } from "./FundoCadastroRepo";

export class FundoCadastroRepoLocal implements FundoCadastroRepo {
  async fundoBusca(filter: string): Promise<Fundo[]> {
    const fundos = [];
    const regex = new RegExp(filter, "ig");
    const addFundo = (fundo: Fundo) => {
      if (regex.test(fundo.razao_social)) fundos.push(fundo);
      return true;
    };
    await this.forEachFundoCadastro(addFundo);
    return fundos;
  }

  async todosOsFundos(): Promise<Fundo[]> {
    const fundos = [];
    const addFundo = (fundo: Fundo) => {
      fundos.push(fundo);
      return true;
    };
    await this.forEachFundoCadastro(addFundo);
    return fundos;
  }

  async fundosEmOperacao(): Promise<Fundo[]> {
    return (await this.todosOsFundos()).filter(
      (fundo) => fundo.situacao === "EM FUNCIONAMENTO NORMAL"
    );
  }

  async syncronize(): Promise<void[]> {
    return this.cache.synchronize();
  }

  async forEachFundoCadastro(
    consumer: (cad: Fundo) => boolean
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
    return await this.cache.forEachCsvRow("cad_fi.csv", ";", csvConsumer);
  }

  cache = new CkanLocalCache("http://dados.cvm.gov.br", "fi-cad", "CSV", true);
}
