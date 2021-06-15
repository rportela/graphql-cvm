import { FundoDiario } from "../entities/FundoDiario";
import { FundoDiarioRepoLocal } from "../repo/FundoDiarioRepoLocal";

export class FundsService {
  repo = new FundoDiarioRepoLocal();

  fundoDiarioMensal(
    year: number,
    month: number,
    cnpjs?: number[]
  ): Promise<FundoDiario[]> {
    return this.repo.fundoDiarioMensal(year, month, cnpjs);
  }
}
