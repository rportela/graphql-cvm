import { FundoCompletoRepoLocal } from "../repo/FundoCompletoRepoLocal";
import { FundoDiarioRepoLocal } from "../repo/FundoDiarioRepoLocal";
import { FundoDiario } from "../types/FundoDiario";
import { fileNameFromUrl } from "../utils/Parsers";

/**
 * Create a syncrhonization object to get all fundo diarios grouped by cnpj.
 * @param repo
 * @param fileName
 * @returns
 */
async function createSyncObject(
  repo: FundoDiarioRepoLocal,
  fileName: string
): Promise<Record<number, FundoDiario[]>> {
  const diarios: Record<number, FundoDiario[]> = {};
  await repo.forEachFundoDiarioInFile(fileName, (fd) => {
    let fdarray = diarios[fd.cnpj];
    if (!fdarray) {
      fdarray = [];
      diarios[fd.cnpj] = fdarray;
    }
    fdarray.push(fd);
    return true;
  });
  return diarios;
}

/**
 * Updates a single fund with new available fundo diario data.
 * @param repo
 * @param cnpj
 * @param diarios
 */
async function updateFundoCompleto(
  repo: FundoCompletoRepoLocal,
  cnpj: number,
  diarios: FundoDiario[]
) {
  const fundo = await repo.load(cnpj);
  for (const diario of diarios) {
    const index = fundo.diario.findIndex(
      (d) => d.competencia === diario.competencia
    );
    if (index >= 0) fundo.diario[index] = diario;
    else fundo.diario.push(diario);
  }
  await repo.save(fundo);
}

/**
 * Updates the fundo completo local repository with the synced object.
 *
 * @param repo
 * @param syncObject
 */
async function executeSyncObject(syncObject: Record<number, FundoDiario[]>) {
  const repoCompleto = new FundoCompletoRepoLocal();
  const cnpjs = Object.keys(syncObject);
  for (const cnpj of cnpjs)
    await updateFundoCompleto(repoCompleto, Number(cnpj), syncObject[cnpj]);
}

export default async function syncFundoDiario() {
  const start_time = new Date();
  const repo = new FundoDiarioRepoLocal();
  console.log("Updating local entities", new Date());

  for (const res of await repo.syncronize()) {
    const file_time = new Date();
    const file = fileNameFromUrl(res.url);
    console.log(file, "...", file_time);
    const syncObject = await createSyncObject(repo, file);
    await executeSyncObject(syncObject);
    console.log(
      "completed",
      file,
      ". Took:",
      (new Date().getTime() - file_time.getTime()) / 1000.0,
      "segs."
    );
  }
  console.log(
    "... complete fundo diario. Took: ",
    (new Date().getTime() - start_time.getTime()) / 1000.0,
    "segs."
  );
}
