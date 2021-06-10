import "reflect-metadata";
import { FundoDiario } from "../entities/FundoDiario";
import { CsvConsumer, parseCsv } from "./TextRepo";
import { dateYmd, digitsOnly } from "../utils/Parsers";

export class CvmFundoDiarioBuilder {
  TP_FUNDO = (source: string, target: FundoDiario) => {
    target.tipo = source;
  };

  CNPJ_FUNDO = (source: string, target: FundoDiario) => {
    target.cnpj = digitsOnly(source);
  };

  DT_COMPTC = (source: string, target: FundoDiario) => {
    target.competencia = dateYmd(source);
  };

  VL_TOTAL = (source: string, target: FundoDiario) => {
    target.carteira = parseFloat(source);
  };

  VL_QUOTA = (source: string, target: FundoDiario) => {
    target.cota = parseFloat(source);
  };

  VL_PATRIM_LIQ = (source: string, target: FundoDiario) => {
    target.pl = parseFloat(source);
  };

  CAPTC_DIA = (source: string, target: FundoDiario) => {
    target.captacao = parseFloat(source);
  };

  RESG_DIA = (source: string, target: FundoDiario) => {
    target.resgates = parseFloat(source);
  };

  NR_COTST = (source: string, target: FundoDiario) => {
    target.cotistas = parseInt(source);
  };

  build(row: string[], headers: string[]): FundoDiario {
    const fd = new FundoDiario();
    fd.extraido_em = new Date();
    for (let i = 0; i < headers.length; i++) {
      const mapping = this[headers[i]];
      if (mapping) {
        mapping(row[i], fd);
      }
    }
    return fd;
  }
}

export class CvmFundoDiario {
  getDownloadUrl(year?: number, month?: number): string {
    if (!year) year = new Date().getFullYear();
    if (!month) month = new Date().getMonth() + 1;
    if (year < 2017) throw new Error("This data is only available after 2017");
    if (month < 1 || month > 12) throw new Error("Inivalid month [1,12]");
    const monthstr = ("00" + month).substr(-2);
    const fileName = "inf_diario_fi_" + year + monthstr + ".csv";
    return "http://dados.cvm.gov.br/dados/FI/DOC/INF_DIARIO/DADOS/" + fileName;
  }
  forEach(
    consumer: CsvConsumer,
    year?: number,
    month?: number
  ): Promise<number> {
    return parseCsv(this.getDownloadUrl(year, month), consumer, ";", true);
  }
  toArray(year?: number, month?: number): Promise<FundoDiario[]> {
    const list: FundoDiario[] = [];
    const builder = new CvmFundoDiarioBuilder();
    return this.forEach(
      (row: string[], lineNumber: number, headers?: string[]) => {
        const fd = builder.build(row, headers!);
        list.push(fd);
      },
      year,
      month
    ).then(() => list);
  }
  filter(
    fn: (fd: FundoDiario) => boolean,
    year?: number,
    month?: number
  ): Promise<FundoDiario[]> {
    const list: FundoDiario[] = [];
    const builder = new CvmFundoDiarioBuilder();
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
