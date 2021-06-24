import { FundoDiarioCsvBuilder } from "../builders/FundoDiarioCsvBuilder";
import { CkanSyncService, EntityConsumer, EntityProducer, EntityTransformer } from "../services/CkanSyncService";
import { FundoDiario } from "../types/FundoDiario";
import { CsvVisitor, forEachCsvRow, readJsonFile, writeJsonFile } from "../utils/Files";

const fundoDiarioProducer: EntityProducer<FundoDiario> = async (fileName: string, gzip: boolean, consumer: EntityConsumer<FundoDiario>) => {
  const builder = new FundoDiarioCsvBuilder();
  const csvConsumer: CsvVisitor = (row: string[], _lineNumber: number, headers: string[]): boolean => {
    const entity = builder.build(row, headers);
    consumer(entity);
    return true;
  }
  await forEachCsvRow(fileName, ";", csvConsumer, true, gzip, "latin1");
}

const fundoDiarioTransformer: EntityTransformer<FundoDiario> = async (service: CkanSyncService<FundoDiario>, key: string, entities: FundoDiario[]) => {
  const locaFile = service.getLocalEntityFile(key);
  let entity = await readJsonFile<FundoDiario[]>(locaFile, true);
  if (entity) {
    for (const entry of entities) {
      const i = entity.findIndex(e => e.competencia === entry.competencia);
      if (i >= 0) entity[i] = entry;
      else entity.push(entry);
    }
  } else entity = entities;
  await writeJsonFile(entities, locaFile, true);
}


const SyncFundoDiario = new CkanSyncService("cvm", "http://dados.cvm.gov.br", "fi-doc-inf_diario", "CSV", true, "cnpj", fundoDiarioProducer, fundoDiarioTransformer);

export default SyncFundoDiario;