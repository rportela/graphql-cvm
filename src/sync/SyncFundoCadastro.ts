import { FundoCadastroRepoLocal } from "../repo/FundoCadastroRepoLocal";
import { FundoCadastro } from "../types/FundoCadastro";
import { writeJsonFile } from "../utils/Files";

async function createSyncObject(
  repo: FundoCadastroRepoLocal
): Promise<Record<number, FundoCadastro[]>> {
  const syncObject: Record<number, FundoCadastro[]> = {};
  await repo.forEachFundoCadastro((cad) => {
    let arr: FundoCadastro[] = syncObject[cad.cnpj];
    if (!arr) {
      arr = [];
      syncObject[cad.cnpj] = arr;
    }
    arr.push(cad);
    return true;
  });
  return syncObject;
}

async function saveSyncObject(
  syncObject: Record<number, FundoCadastro[]>
): Promise<void> {
  for (const cnpj in Object.keys(syncObject)) {
    await saveEntry(cnpj, syncObject[cnpj]);
  }
}

async function saveEntry(cnpj: string, data: FundoCadastro[]): Promise<void> {
  const target = `.data/entities/cvm/fi-cad/${cnpj}.json.gzip`;
  await writeJsonFile(data, target, true);
}

export default async function syncFundoCadastro() {
  const start_time = new Date();
  console.log("Syncing fundo cadastro...", start_time);

  const repo = new FundoCadastroRepoLocal();
  await repo.syncronize();
  const syncObject = await createSyncObject(repo);
  await saveSyncObject(syncObject);

  console.log(
    "... complete fundo cadastro. Took: ",
    (new Date().getTime() - start_time.getTime()) / 1000.0,
    "segs."
  );
}
