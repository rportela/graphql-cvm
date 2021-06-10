import { createReadStream, ReadStream } from "fs";
import fetch from "node-fetch";
import readline from "readline";

export function makeStream(source: string | ReadStream): Promise<ReadStream> {
  if (source instanceof ReadStream) return Promise.resolve(source);
  else if (source.startsWith("http"))
    return fetch(source).then((res) => res.body as ReadStream);
  else return Promise.resolve(createReadStream(source));
}

export function parseLines(
  source: string | ReadStream,
  consumer: (line: string, lineNumber: number) => void
): Promise<number> {
  return new Promise((resolve, reject) => {
    makeStream(source).then((stream) => {
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
  headerRow: boolean = true
): Promise<number> {
  let headers: string[];
  return parseLines(source, (line, lineNumber) => {
    const row = line.split(separator);
    if (headerRow === true && lineNumber === 0) headers = row;
    else consumer(row, lineNumber, headers);
  });
}
