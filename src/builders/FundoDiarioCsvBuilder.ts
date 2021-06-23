import { FundoDiario } from "../types/FundoDiario";
import { dateYmd, digitsOnly } from "../utils/Parsers";
import { CsvBuilder } from "./CsvBuilder";

export class FundoDiarioCsvBuilder extends CsvBuilder<FundoDiario> {
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
    const fd = super.build(row, headers);
    fd.extraido_em = new Date();
    return fd;
  }
}
