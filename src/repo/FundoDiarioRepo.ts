import { FundoDiario } from "../types/FundoDiario";

export interface FundoDiarioRepo {
  fundoDiarioMensal(
    year: number,
    month: number,
    cnpjs?: number[]
  ): Promise<FundoDiario[]>;
}
