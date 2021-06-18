import "reflect-metadata";
import { FundoCadastroRepoLocal } from "./repo/FundoCadastroRepoLocal";
import { FundoDiarioRepoLocal } from "./repo/FundoDiarioRepoLocal";
import { Fundo } from "./types/Fundo";
import { FundoDiario } from "./types/FundoDiario";

async function extract() {
  await Promise.all([
    new FundoDiarioRepoLocal().synchronize(),
    new FundoCadastroRepoLocal().syncronize(),
  ]);
}

function fundDiarioReduce(
  fd: FundoDiario,
  target: Record<number, Record<string, FundoDiario>>
): boolean {
  const rec = target[fd.cnpj];
  rec[fd.competencia.toISOString()] = fd;
  return true;
}

function transformFundoDiario(
  fd: FundoDiario,
  funds: Record<number, Fundo>
): boolean {
  return true;
}

async function transform() {
  const fundsArray = await new FundoCadastroRepoLocal().todosOsFundos();
  const funds = fundsArray.reduce((omap, fundo) => {
    omap[fundo.cnpj] = fundo;
    return omap;
  }, {});
  const diarioRepo = new FundoDiarioRepoLocal();
  const diario_entries = diarioRepo.cache.listEntries();
  diarioRepo.forEachFundoDiarioInFile(diario_entries[0], (fd: FundoDiario) =>
    transformFundoDiario(fd, funds)
  );
}

async function load() {
  return null;
}

async function synchronize() {
  //await extract();
  await transform();
  //await load();
}

synchronize();
