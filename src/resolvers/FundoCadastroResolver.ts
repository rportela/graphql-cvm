import { Arg, Query, Resolver } from "type-graphql";
import { Fundo } from "../types/Fundo";
import { FundoCadastroRepoLocal } from "../repo/FundoCadastroRepoLocal";

@Resolver()
export class FundoCadastroResolver {
  repo = new FundoCadastroRepoLocal();

  @Query(() => [Fundo])
  async todosOsFundos() {
    return this.repo.todosOsFundos();
  }

  @Query(() => [Fundo])
  async fundosEmOperacao() {
    return this.repo.fundosEmOperacao();
  }

  @Query(() => [Fundo])
  async buscarFundo(@Arg("filtro", () => String!) filtro: string) {
    return this.repo.fundoBusca(filtro);
  }
}
