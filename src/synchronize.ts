import "reflect-metadata";
import { FundoCadastroRepoLocal } from "./repo/FundoCadastroRepoLocal";
import { FundoDiarioRepoLocal } from "./repo/FundoDiarioRepoLocal";
import { Fundo } from "./types/Fundo";
import FundoCompleto from "./types/FundoCompleto";
import { FundoDiario } from "./types/FundoDiario";

async function extract() {
  await Promise.all([
    new FundoDiarioRepoLocal().synchronize(),
    new FundoCadastroRepoLocal().syncronize(),
  ]);
}

function transformFundoDiario(
  fd: FundoDiario,
  funds: Record<number, FundoCompleto>
): boolean {
  const completo = funds[fd.cnpj];
  if (completo) {
    completo.diario[fd.competencia.toISOString().substr(0, 10)] = fd;
  }
  return true;
}

async function transform() {
  const fundsArray = await new FundoCadastroRepoLocal().todosOsFundos();
  const funds: Record<number, FundoCompleto> = fundsArray.reduce(
    (omap, fundo) => {
      omap[fundo.cnpj] = {
        cadastro: fundo,
        diario: {},
      } as FundoCompleto;
      return omap;
    },
    {}
  );
  const diarioRepo = new FundoDiarioRepoLocal();
  const diario_entries = diarioRepo.cache.listEntries();
  for (const file of diario_entries) {
    console.log(file);
    await diarioRepo.forEachFundoDiarioInFile(file, (fd: FundoDiario) =>
      transformFundoDiario(fd, funds)
    );
  }

  const cnpj = 8927452000125;
  console.log(funds[cnpj]);
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
