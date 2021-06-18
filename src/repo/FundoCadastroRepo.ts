import { Fundo } from "../types/Fundo";

export interface FundoCadastroRepo {
  todosOsFundos(): Promise<Fundo[]>;
  fundosEmOperacao(): Promise<Fundo[]>;
  fundoBusca(filter: string): Promise<Fundo[]>;
}
