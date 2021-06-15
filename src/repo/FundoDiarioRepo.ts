import { FundoDiario } from "../entities/FundoDiario";

export interface FundoDiarioRepo {
  fundoDiarioMensal(
    year: number,
    month: number,
    cnpjs?: number[]
  ): Promise<FundoDiario[]>;
}
