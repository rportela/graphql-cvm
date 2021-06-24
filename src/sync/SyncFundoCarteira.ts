import { CkanSyncService, EntityConsumer, EntityProducer, EntityTransformer } from "../services/CkanSyncService";
import { FundoCarteiraItem } from "../types/FundoCarteiraItem";
import { CsvVisitor, forEachCsvRow, readJsonFile, writeJsonFile } from "../utils/Files";

const producers : {
  
}


const fundoCarteiraProducer: EntityProducer<FundoCarteiraItem> = async (fileName: string, gzip: boolean, consumer: EntityConsumer<FundoCarteiraItem>) => {
  const builder = new FundoCarteiraCsvBuilder();
  const csvConsumer: CsvVisitor = (row: string[], _lineNumber: number, headers: string[]): boolean => {
    const entity = builder.build(row, headers);
    consumer(entity);
    return true;
  }
  await forEachCsvRow(fileName, ";", csvConsumer, true, gzip, "latin1");
}

const fundoCarteiraTransformer: EntityTransformer<FundoCarteiraItem> = async (service: CkanSyncService<FundoCarteiraItem>, key: string, entities: FundoCarteiraItem[]) => {
  const locaFile = service.getLocalEntityFile(key);
  let entity = await readJsonFile<FundoCarteiraItem[]>(locaFile, true);
  if (entity) {
    for (const entry of entities) {
      const i = entity.findIndex(e => e.competencia === entry.competencia);
      if (i >= 0) entity[i] = entry;
      else entity.push(entry);
    }
  } else entity = entities;
  await writeJsonFile(entities, locaFile, true);
}


const SyncFundoCarteira = new CkanSyncService("cvm", "http://dados.cvm.gov.br", "fi-doc-cda", "ZIP", true, "cnpj", fundoCarteiraProducer, fundoCarteiraTransformer);

export default SyncFundoCarteira;