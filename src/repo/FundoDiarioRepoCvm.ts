import "reflect-metadata";
import { FundoDiario } from "../types/FundoDiario";
import { FundoDiarioCsvBuilder } from "./FundoDiarioCsvBuilder";
import { FundoDiarioRepo } from "./FundoDiarioRepo";
import { CsvConsumer, parseCsv } from "./TextRepo";

export class FundoDiarioRepoCvm implements FundoDiarioRepo {
  /**
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
    return cnpjs
      ? this.filter((fd) => cnpjs.indexOf(fd.cnpj) >= 0)
      : this.toArray(year, month);
  }

  /**
   *
   * @param year
   * @param month
   * @returns
   */
  getDownloadUrl(year?: number, month?: number): string {
    if (!year) year = new Date().getFullYear();
    if (!month) month = new Date().getMonth() + 1;
    if (year < 2017) throw new Error("This data is only available after 2017");
    if (month < 1 || month > 12) throw new Error("Inivalid month [1,12]");
    const monthstr = ("00" + month).substr(-2);
    const fileName = "inf_diario_fi_" + year + monthstr + ".csv";
    return "http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/" + fileName;
  }

  /**
   *
   * @param consumer
   * @param year
   * @param month
   * @returns
   */
  forEach(
    consumer: CsvConsumer,
    year?: number,
    month?: number
  ): Promise<number> {
    return parseCsv(this.getDownloadUrl(year, month), consumer, ";", true);
  }

  /**
   *
   * @param year
   * @param month
   * @returns
   */
  toArray(year?: number, month?: number): Promise<FundoDiario[]> {
    const list: FundoDiario[] = [];
    const builder = new FundoDiarioCsvBuilder();
    return this.forEach(
      (row: string[], lineNumber: number, headers?: string[]) => {
        const fd = builder.build(row, headers!);
        list.push(fd);
      },
      year,
      month
    ).then(() => list);
  }

  /**
   *
   * @param fn
   * @param year
   * @param month
   * @returns
   */
  filter(
    fn: (fd: FundoDiario) => boolean,
    year?: number,
    month?: number
  ): Promise<FundoDiario[]> {
    const list: FundoDiario[] = [];
    const builder = new FundoDiarioCsvBuilder();
    return this.forEach(
      (row: string[], lineNumber: number, headers?: string[]) => {
        const fd = builder.build(row, headers!);
        if (fn(fd)) list.push(fd);
      },
      year,
      month
    ).then(() => list);
  }
}
