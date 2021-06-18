import { Arg, Int, Query, Resolver } from "type-graphql";
import { FundoDiario } from "../types/FundoDiario";
import { FundoDiarioService } from "../services/FundoDiarioService";
import Long from "../utils/Long";

@Resolver()
export class FundoDiarioResolver {
  service = new FundoDiarioService();

  @Query((returns) => [FundoDiario])
  async diario(
    @Arg("cnpjs", () => [Long!]!) cnpjs: number[],
    @Arg("year", () => Int) year?: number,
    @Arg("month", () => Int) month?: number
  ) {
    console.log(cnpjs, year, month);
    return this.service.fundoDiarioMensal(year, month, cnpjs);
  }
}
