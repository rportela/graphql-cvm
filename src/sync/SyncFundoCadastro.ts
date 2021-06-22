import { FundoCadastroRepoLocal } from "../repo/FundoCadastroRepoLocal";
import { FundoCadastro } from "../types/FundoCadastro";

async function createSyncObject(repo: FundoCadastroRepoLocal): Promise<Record<number, FundoCadastro[]>> {
  const syncObject: Record<number, FundoCadastro[]> = {};
  await repo.forEachFundoCadastro((cad) => {
    let arr: FundoCadastro[] = syncObject[cad.cnpj];
    if (!arr) {
      arr = [];
      syncObject[cad.cnpj] = arr;
    }
    arr.push(cad)
    return true;
  });
  return syncObject;
}

async function updateSyncObject(repo: FundoCadastroRepoLocal, syncObject: Record<number, FundoCadastro[]>) {
  for (const cnpj in Object.keys(syncObject)) {
    await repo.updateCadastro(cnpj, syncObject[cnpj]);
  }
}



export default async function syncFundoCadastro() {
  const start_time = new Date();
  console.log("Syncing fundo cadastro...", start_time);

  const repo = new FundoCadastroRepoLocal();
  const res = await repo.syncronize();
  //if (res && res.length > 0) {
    const syncObject = await createSyncObject(repo);
    await updateSyncObject(repo, syncObject);
  //}

  console.log(
    "... complete fundo cadastro. Took: ",
    (new Date().getTime() - start_time.getTime()) / 1000.0,
    "segs."
  );
}
