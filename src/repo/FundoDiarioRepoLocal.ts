import { FundoDiario } from "../entities/FundoDiario";
import { CkanLocalCache } from "./CkanLocalCache";
import { FundoDiarioCsvBuilder } from "./FundoDiarioCsvBuilder";
import { FundoDiarioRepo } from "./FundoDiarioRepo";
import { CsvConsumer } from "./TextRepo";

export class FundoDiarioRepoLocal implements FundoDiarioRepo {
  cache = new CkanLocalCache({
    api_url: "http://dados.cvm.gov.br",
    package_id: "fi-doc-inf_diario",
    file_format: "CSV",
    gzip: true,
  });

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
        })
      : this.forEachFundoDiario(year, month, (fd) => result.push(fd));
    return p.then(() => result);
  }

  /**
   *
   */
  async populate() {
    console.log("FundoDiarioRepoLocal populating from start...");
    const end_date = new Date();
    const end_year = end_date.getFullYear();
    this.cache.ensureLocalFolder();
    for (let year = 2017; year <= end_year; year++) {
      for (let month = 1; month <= 12; month++) {
        const dt = new Date(year, month - 1, 1);
        if (dt.getTime() > end_date.getTime()) break;
        const url = `http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/inf_diario_fi_${year}${(
          "00" + month
        ).substr(-2)}.csv`;
        try {
          await this.cache.saveResource({
            url: url,
            format: "CSV",
            id: url,
            created: new Date().toISOString(),
          });
        } catch (err) {
          console.error(err);
        }
      }
    }
  }

  /**
   * Synchronizes local resources with CKAN data portal.
   */
  async synchronize() {
    console.log("FundoDiarioRepoLocal starting...");
    const startTime = new Date();
    await this.cache.synchronize();
    const endTime = new Date();
    console.log(
      "...FundoDiarioRepoLocal completed, took",
      (endTime.getTime() - startTime.getTime()) / 1000.0,
      "segs."
    );
  }

  /**
   * Gets the filename based on year and month.
   * @param year
   * @param month
   * @returns
   */
  getFileName(year: number, month: number) {
    const localFile = this.cache.getFilePath(
      `inf_diario_fi_${year}${("00" + month).substr(-2)}.csv`
    );
    return this.cache.config.gzip === true ? localFile + ".gz" : localFile;
  }

  async forEachFundoDiario(
    year: number,
    month: number,
    consumer: (fd: FundoDiario) => void
  ): Promise<number> {
    const builder = new FundoDiarioCsvBuilder();
    const csvConsumer: CsvConsumer = (
      row: string[],
      _line_number: number,
      headers: string[]
    ) => {
      const fd = builder.build(row, headers);
      consumer(fd);
    };
    return await this.cache.forEachOnCsvFile(
      `inf_diario_fi_${year}${("00" + month).substr(-2)}.csv`,
      csvConsumer
    );
  }
}
