import { FundoCadastroCsvBuilder } from "../builders/FundoCadastroCsvBuilder";
import { CkanSyncService, EntityConsumer, EntityProducer, EntityTransformer } from "../services/CkanSyncService";
import { FundoCadastro } from "../types/FundoCadastro";
import { CsvVisitor, forEachCsvRow, writeJsonFile } from "../utils/Files";

const fundoCadastroProducer: EntityProducer<FundoCadastro> = async (fileName: string, gzip: boolean, consumer: EntityConsumer<FundoCadastro>) => {
  const builder = new FundoCadastroCsvBuilder();
  const csvConsumer: CsvVisitor = (row: string[], _lineNumber: number, headers: string[]): boolean => {
    const entity = builder.build(row, headers);
    consumer(entity);
    return true;
  }
  await forEachCsvRow(fileName, ";", csvConsumer, true, gzip, "latin1");
}

const fundoCadastroTransformer: EntityTransformer<FundoCadastro> = async (service: CkanSyncService<FundoCadastro>, key: string, entities: FundoCadastro[]) => {
  const locaFile = service.getLocalEntityFile(key);
  await writeJsonFile(entities, locaFile, true);
}


const SyncFundoCadastro = new CkanSyncService("cvm", "http://dados.cvm.gov.br", "fi-cad", "CSV", true, "cnpj", fundoCadastroProducer, fundoCadastroTransformer);

export default SyncFundoCadastro;