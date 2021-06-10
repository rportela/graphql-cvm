import { Arg, Int, Query, Resolver } from "type-graphql";
import { FundoDiario } from "../entities/FundoDiario";
import { CvmFundoDiario } from "../repo/CvmFundoDiario";
import Long from "../utils/Long";

@Resolver()
export class FundoDiarioResolver {
  @Query((returns) => [FundoDiario])
  async diario(
    @Arg("cnpjs", () => [Long!]!) cnpjs: number[],
    @Arg("year", () => Int) year?: number,
    @Arg("month", () => Int) month?: number
  ) {
    console.log(cnpjs, year, month);
    if (!cnpjs || cnpjs.length === 0)
      throw new Error("É preciso indicar uma lista de cnpjs");
    return new CvmFundoDiario().filter(
      (fd: FundoDiario) => cnpjs.indexOf(fd.cnpj) >= 0,
      year,
      month
    );
  }
}
