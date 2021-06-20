import { FundoCadastro } from "../types/FundoCadastro";

export interface FundoCadastroRepo {
  todosOsFundos(): Promise<FundoCadastro[]>;
  fundosEmOperacao(): Promise<FundoCadastro[]>;
  fundoBusca(filter: string): Promise<FundoCadastro[]>;
}
