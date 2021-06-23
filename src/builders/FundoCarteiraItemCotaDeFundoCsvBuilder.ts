import { FundoCarteiraItemCotaDeFundo } from "../types/FundoCarteiraItemCotaDeFundo";
import { digitsOnly } from "../utils/Parsers";
import { FundoCarteiraItemCsvBuilder } from "./FundoCarteiraItemCsvBuilder";

export class FundoCarteiraItemCotaDeFundoCsvBuilder extends FundoCarteiraItemCsvBuilder<FundoCarteiraItemCotaDeFundo> {
  CNPJ_FUNDO_COTA = (value: string, target: FundoCarteiraItemCotaDeFundo) => {
    target.investido_cnpj = digitsOnly(value);
  };

  NM_FUNDO_COTA = (value: string, target: FundoCarteiraItemCotaDeFundo) => {
    target.investido_nome = value;
  };
}
