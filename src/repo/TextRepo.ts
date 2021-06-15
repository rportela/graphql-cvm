import { createReadStream, ReadStream } from "fs";
import fetch from "node-fetch";
import readline from "readline";
import { createGunzip } from "zlib";

export function makeStream(
  source: string | ReadStream,
  gunzip: boolean = false
): Promise<ReadStream> {
  if (source instanceof ReadStream) return Promise.resolve(source);
  else if (source.startsWith("http")) {
    const rs = fetch(source).then((res) => res.body as ReadStream);
    return gunzip ? rs.then((rs) => rs.pipe(createGunzip())) : rs;
  } else {
    const rs = createReadStream(source);
    return gunzip
      ? Promise.resolve(rs.pipe(createGunzip()) as unknown as ReadStream)
      : Promise.resolve(rs);
  }
}

export function parseLines(
  source: string | ReadStream,
  consumer: (line: string, lineNumber: number) => void,
  gunzip: boolean = false
): Promise<number> {
  return new Promise((resolve, reject) => {
    makeStream(source, gunzip).then((stream) => {
      let lineNumber: number = 0;
      stream.on("error", reject);
      readline
        .createInterface(stream)
        .on("line", (line) => {
          consumer(line, lineNumber);
          lineNumber++;
        })
        .on("close", () => resolve(lineNumber));
    });
  });
}

export interface CsvConsumer {
  (row: string[], lineNumber: number, headers?: string[]): void;
}

export function parseCsv(
  source: string | ReadStream,
  consumer: CsvConsumer,
  separator: string = ",",
  headerRow: boolean = true,
  gunzip: boolean = false
): Promise<number> {
  let headers: string[];
  return parseLines(
    source,
    (line, lineNumber) => {
      const row = line.split(separator);
      if (headerRow === true && lineNumber === 0) headers = row;
      else consumer(row, lineNumber, headers);
    },
    gunzip
  );
}
