import { Fundo } from "../types/Fundo";

export interface FundRepo {
  readFund(cnpj: number): Promise<Fundo>;
  saveFund(fund: Fundo): Promise<void>;
}
