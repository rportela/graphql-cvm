import { ReadStream } from "fs";
import { JSZipObject } from "jszip";
import { CsvBuilder } from "../builders/CsvBuilder";
import { FundoCarteiraItemCotaDeFundoCsvBuilder } from "../builders/FundoCarteiraItemCotaDeFundoCsvBuilder";
import { FundoCarteiraItemSelicCsvBuilder } from "../builders/FundoCarteiraItemSelicCsvBuilder";
import { FundoCarteiraItemSwapCsvBuilder } from "../builders/FundoCarteiraItemSwapCsvBuilder";
import { FundoCarteiraRepoLocal } from "../repo/FundoCarteiraRepoLocal";
import { FundoCarteiraItem } from "../types/FundoCarteiraItem";
import { forEachCsvRow, forEachLine, forEachZipEntry } from "../utils/Files";

async function processZipEntryCsv<T>(
  entry: JSZipObject,
  builder: CsvBuilder<T>,
  updateObject: Record<number, unknown>
) {
  await forEachCsvRow(
    entry.nodeStream() as ReadStream,
    ";",
    (row: string[], _lineNumber: number, headers: string[]) => {
      const entity: T = builder.build(row, headers);
      const cnpj = entity["cnpj"];
      if (!cnpj) console.log("no cnpj", entity);
      let arr = updateObject[cnpj] as T[];
      if (!arr) {
        arr = [];
        updateObject[cnpj] = arr;
      }
      arr.push(entity);
      return true;
    },
    true,
    false,
    "latin1"
  );
}

const ZipEntryProcessor = {
  cda_fi_BLC_1_: new FundoCarteiraItemSelicCsvBuilder(),
  cda_fi_BLC_2_: new FundoCarteiraItemCotaDeFundoCsvBuilder(),
  cda_fi_BLC_3_: new FundoCarteiraItemSwapCsvBuilder(),
};

async function processZipEntry(
  entry: JSZipObject,
  updateObject: Record<number, unknown>
) {
  for (const key of Object.getOwnPropertyNames(ZipEntryProcessor)) {
    if (entry.name.startsWith(key)) {
      return await processZipEntryCsv(
        entry,
        ZipEntryProcessor[key],
        updateObject
      );
    }
  }
  return await testLineReader(entry);
}

async function testLineReader(entry: JSZipObject) {
  const linecount = await forEachLine(
    entry.nodeStream() as ReadStream,
    () => true
  );
  console.log(entry.name, linecount);
}

async function buildUpdateObject(
  file: string
): Promise<Record<number, FundoCarteiraItem[]>> {
  const updateObject: Record<number, FundoCarteiraItem[]> = {};
  await forEachZipEntry(file, (entry) => processZipEntry(entry, updateObject));
  return updateObject;
}

async function applyUpdateObject(
  updateObject: Record<number, FundoCarteiraItem[]>
) {
  console.log("PLEASE implement this");
}

export default async function syncFundoCarteira() {
  const repo = new FundoCarteiraRepoLocal();
  const file = repo.getFilePath(2021, 5);
  console.log(file);
  const updateObject = await buildUpdateObject(file);
  await applyUpdateObject(updateObject);
  console.log(Object.keys(updateObject));
  console.log(updateObject[8927452000125]);
  console.log(updateObject[Number("26745153000151")]);
}
