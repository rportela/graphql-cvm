import { FundoCarteiraItemSwap } from "../types/FundoCarteiraItemSwap";
import { FundoCarteiraItemCsvBuilder } from "./FundoCarteiraItemCsvBuilder";

export class FundoCarteiraItemSwapCsvBuilder extends FundoCarteiraItemCsvBuilder<FundoCarteiraItemSwap> {
  CD_SWAP = (value: string, target: FundoCarteiraItemSwap) => {
    target.swap_codigo = value;
  };

  DS_SWAP = (value: string, target: FundoCarteiraItemSwap) => {
    target.swap_descricao = value;
  };
}
