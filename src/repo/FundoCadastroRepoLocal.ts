import { existsSync } from "fs";
import { Fundo } from "../entities/Fundo";
import { CkanLocalCache } from "./CkanLocalCache";
import { FundoCadastroCsvBuilder } from "./FundoCadastroCsvBuilder";
import { FundoCadastroRepo } from "./FundoCadastroRepo";
import { CsvConsumer, parseCsv } from "./TextRepo";

export class FundoCadastroRepoLocal implements FundoCadastroRepo {
  async fundoBusca(filter: string): Promise<Fundo[]> {
    const fundos = [];
    const regex = new RegExp(filter, "ig");
    const addFundo = (fundo: Fundo) => {
      if (regex.test(fundo.razao_social)) fundos.push(fundo);
    };
    await this.forEachFundoCadastro(addFundo);
    return fundos;
  }

  async todosOsFundos(): Promise<Fundo[]> {
    const fundos = [];
    const addFundo = (fundo: Fundo) => fundos.push(fundo);
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

  async forEachFundoCadastro(consumer: (cad: Fundo) => void): Promise<number> {
    const builder = new FundoCadastroCsvBuilder();
    const csvConsumer: CsvConsumer = (
      row: string[],
      _line_number: number,
      headers: string[]
    ) => {
      const fd = builder.build(row, headers);
      consumer(fd);
    };
    return await this.cache.forEachOnCsvFile("cad_fi.csv", csvConsumer);
  }

  cache = new CkanLocalCache({
    api_url: "http://dados.cvm.gov.br",
    package_id: "fi-cad",
    file_format: "CSV",
    gzip: true,
  });
}
