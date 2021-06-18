import { Fundo } from "./Fundo";
import { FundoDiario } from "./FundoDiario";

export default interface FundoCompleto {
  cadastro: Fundo;
  diario: Record<string, FundoDiario>;
}
