import "reflect-metadata";
import { FundoCadastroRepoLocal } from "./repo/FundoCadastroRepoLocal";
import { FundoDiarioRepoLocal } from "./repo/FundoDiarioRepoLocal";

async function synchronize() {
  await Promise.all([
    new FundoDiarioRepoLocal().populate(),
    new FundoCadastroRepoLocal().syncronize(),
  ]);
}

synchronize();
