import { CkanResource } from "../types";
import { FundoDiario } from "../types/FundoDiario";
import { CkanLocalCache } from "./CkanLocalCache";
import { CsvVisitor } from "./DataFolder";
import { FundoDiarioCsvBuilder } from "./FundoDiarioCsvBuilder";
import { FundoDiarioRepo } from "./FundoDiarioRepo";

export class FundoDiarioRepoLocal implements FundoDiarioRepo {
  cache = new CkanLocalCache(
    "http://dados.cvm.gov.br",
    "fi-doc-inf_diario",
    "CSV",
    true
  );

  /**
   * Retorna as informações diárias de fundos para um dado ano e mês.
   *
   * @param year
   * @param month
   * @param cnpjs
   * @returns
   */
  fundoDiarioMensal(
    year: number,
    month: number,
    cnpjs?: number[]
  ): Promise<FundoDiario[]> {
    const result: FundoDiario[] = [];
    const p = cnpjs
      ? this.forEachFundoDiario(year, month, (fd) => {
          if (cnpjs.indexOf(fd.cnpj)) result.push(fd);
          return true;
        })
      : this.forEachFundoDiario(year, month, (fd) => {
          result.push(fd);
          return true;
        });
    return p.then(() => result);
  }

  /**
   *
   * @param year
   * @param month
   * @returns
   */
  getFileName(year: number, month: number): string {
    return `inf_diario_fi_${year}${("00" + month).substr(-2)}.csv`;
  }

  /**
   *
   */
  async populate() {
    console.log("FundoDiarioRepoLocal populating from start...");
    const end_date = new Date();
    const end_year = end_date.getFullYear();
    for (let year = 2017; year <= end_year; year++) {
      for (let month = 1; month <= 12; month++) {
        const dt = new Date(year, month - 1, 1);
        if (dt.getTime() > end_date.getTime()) break;
        const url =
          "http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/" +
          this.getFileName(year, month);
        await this.cache.download(url);
      }
    }
    console.log("FundoDiarioRepoLocal populating completed.");
  }

  /**
   * Synchronizes local resources with CKAN data portal.
   */
  async syncronize(): Promise<CkanResource[]> {
    return this.cache.synchronize();
  }

  /**
   * Gets the filename based on year and month.
   * @param year
   * @param month
   * @returns
   */
  getFilePath(year: number, month: number) {
    return this.cache.getFilePath(this.getFileName(year, month));
  }

  /**
   *
   * @param year
   * @param month
   * @param consumer
   * @returns
   */
  async forEachFundoDiario(
    year: number,
    month: number,
    consumer: (fd: FundoDiario) => boolean
  ): Promise<number> {
    return await this.forEachFundoDiarioInFile(
      this.getFileName(year, month),
      consumer
    );
  }

  /**
   *
   * @param fileName
   * @param consumer
   * @returns
   */
  async forEachFundoDiarioInFile(
    fileName: string,
    consumer: (fd: FundoDiario) => boolean
  ): Promise<number> {
    const builder = new FundoDiarioCsvBuilder();
    const csvConsumer: CsvVisitor = (
      row: string[],
      _line_number: number,
      headers: string[]
    ) => {
      const fd = builder.build(row, headers);
      return consumer(fd);
    };
    return await this.cache.forEachCsvRow(fileName, ";", csvConsumer);
  }
}
