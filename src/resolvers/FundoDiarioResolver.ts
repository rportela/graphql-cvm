import { Arg, Int, Query, Resolver } from "type-graphql";
import { FundoDiarioRepoLocal } from "../repo/FundoDiarioRepoLocal";
import { FundoDiario } from "../types/FundoDiario";
import Long from "../utils/Long";

@Resolver()
export class FundoDiarioResolver {
  repo = new FundoDiarioRepoLocal();

  @Query((returns) => [FundoDiario])
  async diario(
    @Arg("cnpjs", () => [Long!]!) cnpjs: number[],
    @Arg("year", () => Int) year?: number,
    @Arg("month", () => Int) month?: number
  ) {
    console.log(cnpjs, year, month);
    return this.repo.fundoDiarioMensal(year, month, cnpjs);
  }
}
