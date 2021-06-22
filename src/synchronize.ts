import "reflect-metadata";
import { FundoCompletoRepoLocal } from "./repo/FundoCompletoRepoLocal";
import syncFundoCadastro from "./sync/SyncFundoCadastro";
import syncFundoCarteira from "./sync/SyncFundoCarteira";
import syncFundoDiario from "./sync/SyncFundoDiario";

async function synchronize() {
  await syncFundoCadastro();
  //await syncFundoDiario();
  //await syncFundoCarteira();

  const cnpj = 8927452000125;
  //const fundo = await new FundoCompletoRepoLocal().load(cnpj);
  //console.log(fundo);
}

synchronize();
