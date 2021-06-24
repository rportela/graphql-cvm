import "reflect-metadata";
import SyncFundoCadastro from "./sync/SyncFundoCadastro";
import SyncFundoDiario from "./sync/SyncFundoDiario";

async function synchronize() {
  await SyncFundoCadastro.synchronize();
  await SyncFundoDiario.synchronize();

  const cnpj = 8927452000125;
  //const fundo = await new FundoCompletoRepoLocal().load(cnpj);
  //console.log(fundo);
}

synchronize();
