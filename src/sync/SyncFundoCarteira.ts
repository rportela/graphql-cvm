import { ReadStream } from "fs";
import { JSZipObject } from "jszip";
import { FundoCarteiraRepoLocal } from "../repo/FundoCarteiraRepoLocal";
import { forEachLine, forEachZipEntry } from "../utils/Files";

async function processZipEntry(entry: JSZipObject) {
  const linecount = await forEachLine(
    entry.nodeStream() as ReadStream,
    () => true
  );
  console.log(entry.name, linecount);
}

export default function syncFundoCarteira() {
  const repo = new FundoCarteiraRepoLocal();
  const file = repo.getFilePath(2021, 5);
  console.log(file);
  forEachZipEntry(file, processZipEntry);
}
