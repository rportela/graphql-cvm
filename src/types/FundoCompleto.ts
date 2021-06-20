import { FundoCadastro } from "./FundoCadastro";
import { FundoDiario } from "./FundoDiario";

export interface FundoCompleto {
  cadastro: FundoCadastro;
  historico?: FundoCadastro[];
  diario: Record<string, FundoDiario>;
}
