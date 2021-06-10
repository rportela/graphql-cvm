import { Fundo } from "../entities/Fundo";

export interface FundRepo {
  readFund(cnpj: number): Promise<Fundo>;
  saveFund(fund: Fundo): Promise<void>;
}
