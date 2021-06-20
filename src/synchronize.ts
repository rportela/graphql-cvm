import "reflect-metadata";
import syncFundoCarteira from "./sync/SyncFundoCarteira";

async function synchronize() {
  await syncFundoCarteira();
  //await syncFundoCadastro();
  //await syncFundoDiario();
  //const cnpj = 8927452000125;
  //const fundo = await new FundoCompletoRepoLocal().load(cnpj);
  //console.log(fundo);
}

synchronize();
