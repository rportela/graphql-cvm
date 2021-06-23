import { FundoCarteiraItemSelic } from "../types/FundoCarteiraItemSelic";
import { dateYmd } from "../utils/Parsers";
import { FundoCarteiraItemCsvBuilder } from "./FundoCarteiraItemCsvBuilder";

export class FundoCarteiraItemSelicCsvBuilder extends FundoCarteiraItemCsvBuilder<FundoCarteiraItemSelic> {
  CD_ISIN = (value: string, target: FundoCarteiraItemSelic) => {
    target.isin = value;
  };

  CD_SELIC = (value: string, target: FundoCarteiraItemSelic) => {
    if (value) target.selic_id = parseInt(value);
  };

  DT_EMISSAO = (value: string, target: FundoCarteiraItemSelic) => {
    target.emissao = dateYmd(value);
  };

  DT_VENC = (value: string, target: FundoCarteiraItemSelic) => {
    target.vencimento = dateYmd(value);
  };

  TP_TITPUB = (value: string, target: FundoCarteiraItemSelic) => {
    target.tit_publico_tipo = value;
  };
}
