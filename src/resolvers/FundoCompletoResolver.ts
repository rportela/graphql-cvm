import { Arg, Query, Resolver } from "type-graphql";
import { FundoCompletoRepoLocal } from "../repo/FundoCompletoRepoLocal";
import { FundoCompleto } from "../types/FundoCompleto";

@Resolver()
export class FundoCompletoResolver {
  repo = new FundoCompletoRepoLocal();

  @Query(() => FundoCompleto)
  async fundo(@Arg("cnpj") cnpj: number) {
    return this.repo.load(cnpj);
  }
}
