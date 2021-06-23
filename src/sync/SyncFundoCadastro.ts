import { FundoCadastroRepoLocal } from "../repo/FundoCadastroRepoLocal";
import { FundoCompletoRepoLocal } from "../repo/FundoCompletoRepoLocal";
import { FundoCompleto } from "../types/FundoCompleto";

async function createSyncObject() {
  const fundos: Record<number, FundoCompleto> = {};
  await new FundoCadastroRepoLocal().forEachFundoCadastro((cad) => {
    let completo: FundoCompleto = fundos[cad.cnpj];
    // Registro completo não existia.
    if (!completo) {
      completo = {
        cadastro: cad,
        historico: [],
        diario: [],
      };
      fundos[cad.cnpj] = completo;
    }
    // Registro completo já existia.
    else {
      // O cadastro é mais novo que o anterior.
      if (cad.situacao_data > completo.cadastro.situacao_data) {
        completo.historico.push(completo.cadastro);
        completo.cadastro = cad;
      }
      // Se mais velho, atualizar o histórico.
      else {
        completo.historico.push(cad);
      }
    }
    return true;
  });
  return fundos;
}

export default async function syncFundoCadastro() {
  const start_time = new Date();
  console.log("Syncing fundo cadastro...", start_time);
  const synObject = await createSyncObject();
  const repo = new FundoCompletoRepoLocal();
  for (const fundo of Object.values(synObject)) {
    await repo.save(fundo);
  }
  console.log(
    "... complete fundo cadastro. Took: ",
    (new Date().getTime() - start_time.getTime()) / 1000.0,
    "segs."
  );
}
