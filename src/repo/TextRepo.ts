import { createReadStream, ReadStream } from "fs";
import fetch from "node-fetch";
import { Gunzip } from "node:zlib";
import readline from "readline";
import { createGunzip } from "zlib";

export async function makeStream(
  source: string | ReadStream,
  gunzip: boolean = false
): Promise<ReadStream | Gunzip> {
  let stream: ReadStream;

  if (source instanceof ReadStream) {
    stream = source;
  } else if (source.startsWith("http")) {
    stream = await fetch(source).then((res) => res.body as ReadStream);
  } else {
    stream = createReadStream(source);
  }
  return gunzip ? stream.pipe(createGunzip()) : stream;
}

export async function parseLines(
  source: string | ReadStream,
  consumer: (line: string, lineNumber: number) => void,
  gunzip: boolean = false
): Promise<number> {
  let lineNumber = 0;
  const stream = await makeStream(source, gunzip);
  stream.setEncoding("latin1");

  const rl = readline.createInterface({
    input: stream,
  });

  for await (const line of rl) {
    consumer(line, lineNumber);
    lineNumber++;
  }

  return lineNumber;
}

export interface CsvConsumer {
  (row: string[], lineNumber: number, headers?: string[]): void;
}

export async function parseCsv(
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
