import { FundoDiario } from "../entities/FundoDiario";

export interface FundoDiarioRepoConsumer {
  (diario: FundoDiario): void;
}
export interface FundoDiarioRepo {
  forEach: (
    year: number,
    month: number,
    consumer: FundoDiarioRepoConsumer
  ) => Promise<void>;
}
