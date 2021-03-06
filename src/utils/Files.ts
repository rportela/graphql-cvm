import {
  createReadStream,
  createWriteStream,
  existsSync, PathLike,
  ReadStream
} from "fs";
import { readFile, writeFile } from "fs/promises";
import JSZip from "jszip";
import fetch from "node-fetch";
import readline from "readline";
import { createGunzip, createGzip, Gunzip, gunzipSync, gzipSync } from "zlib";

/**
 * A line visitor should consume a text line and return true if more lines should be read or false if there are no more relevant lines to be consumed.
 */
export interface LineVisitor {
  (line: string, lineNumber: number): boolean;
}

/**
 * A CSV visitor should consume a record and return true if more records should be read or false if there are no more relevant records to be consumed.
 */
export interface CsvVisitor {
  (row: string[], lineNumber: number, headers?: string[]): boolean;
}

/**
 *
 */
export interface ZipEntryVisitor {
  (entry: JSZip.JSZipObject): Promise<void>;
}

/**
 * Handy method to create a read stream from an url or local file, with gzip support and encoding.
 * @param source
 * @param gunzip
 * @param encoding
 * @returns
 */
export function getReadStream(
  source: string | ReadStream,
  gunzip?: boolean,
  encoding?: BufferEncoding
): ReadStream | Gunzip {
  let stream: ReadStream | Gunzip;
  if (typeof (source) === "string") {
    stream = createReadStream(source as PathLike)
  } else stream = source as ReadStream;
  if (gunzip === true) stream = stream.pipe(createGunzip());
  if (encoding) stream.setEncoding(encoding);
  return stream;
}

/**
 *
 * @param source
 * @param target
 * @param gzip
 */
export async function writeJsonFile<T>(
  source: T,
  target: PathLike,
  gzip?: boolean
) {
  const content = JSON.stringify(source);
  if (gzip === true) {
    const gcontent = gzipSync(content);
    await writeFile(target, gcontent);
  } else {
    await writeFile(target, content);
  }
}

/**
 *
 * @param source
 * @param gzip
 * @returns
 */
export async function readJsonFile<T>(
  source: PathLike,
  gzip?: boolean
): Promise<T | undefined> {
  if (!existsSync(source)) return undefined;
  const buff = await readFile(source);
  let content: string;
  if (gzip === true) {
    const gbuff = gunzipSync(buff);
    content = gbuff.toString();
  } else {
    content = buff.toString();
  }
  return JSON.parse(content);
}

/**
  * This method simply downloads from an url and may decide the file name if none is provided.
  *
  * @param url
  * @param fileName
  * @returns
  */
export async function download(url: string, target: string, gzip?: boolean) {
  console.log("downloading", url, target, gzip);
  return fetch(url)
    .then((res) => res.body)
    .then(
      (body) =>
        new Promise((resolve, reject) => {
          const start = gzip ? body.pipe(createGzip()) : body;
          start
            .pipe(createWriteStream(target))
            .on("close", resolve)
            .on("error", reject);
        })
    );
}

/**
 * Helpful method to visit lines in a source;
 * The visitor should return true if more lines should be read from the source.
 * Or false, otherwise.
 *
 * @param source
 * @param visitor
 * @param gunzp
 * @param encoding
 * @returns
 */
export async function forEachLine(
  source: string | ReadStream,
  visitor: LineVisitor,
  gunzp?: boolean,
  encoding?: BufferEncoding
): Promise<number> {
  const stream = await getReadStream(source, gunzp, encoding);

  let lineNumber = 0;
  const rl = readline.createInterface({
    input: stream,
  });

  for await (const line of rl) {
    if (!visitor(line, lineNumber)) break;
    lineNumber++;
  }

  rl.close();
  return lineNumber;
}

/**
 * This method parses a CSV file row by row.
 * You should provide the separator and a visitor that returns true if more lines should be read or false otherwise.
 * Optionally you can specify if the first row has headers or not.
 *
 * @param source
 * @param separator
 * @param visitor
 * @param headerRow
 * @param gunzip
 * @param encoding
 * @returns
 */
export async function forEachCsvRow(
  source: string | ReadStream,
  separator: string,
  visitor: CsvVisitor,
  headerRow: boolean = true,
  gunzip?: boolean,
  encoding?: BufferEncoding
): Promise<number> {
  let headers: string[];
  const line: LineVisitor = (line: string, lineNumber: number): boolean => {
    const row = line.split(separator);
    if (headerRow === true && lineNumber === 0) {
      headers = row;
      return true;
    } else return visitor(row, lineNumber, headers);
  };
  return await forEachLine(source, line, gunzip, encoding);
}

/**
 * Reads source to a CSV.
 *
 * @param source
 * @param separator
 * @param gunzip
 * @param encoding
 * @returns
 */
export async function readCsv(
  source: string | ReadStream,
  separator: string,
  gunzip?: boolean,
  encoding?: BufferEncoding
) {
  let headers: string[];
  let rows = [];
  const line = (line: string, lineNumber: number): boolean => {
    const row = line.split(separator);
    if (lineNumber === 0) headers = row;
    else {
      const entry = {};
      for (let i = 0; i < row.length; i++) {
        entry[headers[i]] = row[i];
      }
      rows.push(entry);
    }
    return true;
  };
  await forEachLine(source, line, gunzip, encoding);
  return rows;
}

/**
 *
 * @param source
 * @param vistor
 */
export async function forEachZipEntry(
  source: string,
  vistor: ZipEntryVisitor
): Promise<void> {
  const blob = await readFile(source);
  const zip = await JSZip.loadAsync(blob);
  const files = Object.keys(zip.files);
  for (const file of files) {
    const zipEntry = zip.file(file);
    await vistor(zipEntry);
  }
}
