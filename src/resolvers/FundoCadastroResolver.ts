import { Arg, Query, Resolver } from "type-graphql";
import { FundoCadastro } from "../types/FundoCadastro";
import { FundoCadastroRepoLocal } from "../repo/FundoCadastroRepoLocal";

@Resolver()
export class FundoCadastroResolver {
  repo = new FundoCadastroRepoLocal();

  @Query(() => [FundoCadastro])
  async todosOsFundos() {
    return this.repo.todosOsFundos();
  }

  @Query(() => [FundoCadastro])
  async fundosEmOperacao() {
    return this.repo.fundosEmOperacao();
  }

  @Query(() => [FundoCadastro])
  async buscarFundo(@Arg("filtro", () => String!) filtro: string) {
    return this.repo.fundoBusca(filtro);
  }
}
