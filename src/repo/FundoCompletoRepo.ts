import { FundoCompleto } from "../types/FundoCompleto";

export interface FundoCompletoRepo {
  load(cnpj: number): Promise<FundoCompleto | undefined>;
  save(completo: FundoCompleto): Promise<void>;
}
