import {
  createReadStream,
  createWriteStream,
  PathLike,
  ReadStream,
  WriteStream,
} from "fs";
import { readFile } from "fs/promises";
import JSZip from "jszip";
import fetch from "node-fetch";
import readline from "readline";
import { createGunzip, createGzip, Gunzip } from "zlib";

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
export async function getReadStream(
  source: string | ReadStream,
  gunzip?: boolean,
  encoding?: BufferEncoding
): Promise<ReadStream | Gunzip> {
  let stream: ReadStream | Gunzip;
  if (source instanceof String) {
    stream = source.startsWith("http")
      ? await fetch(source).then((res) => res.body)
      : createReadStream(source as PathLike);
  } else stream = source as ReadStream;
  if (gunzip === true) stream = stream.pipe(createGunzip());
  if (encoding) stream.setEncoding(encoding);
  return stream;
}

/**
 * Handy method to create a write stream to save data with gzip support.
 *
 * @param fileName
 * @param gzip
 * @returns
 */
export async function getWriteStream(
  target: string | WriteStream,
  gzip?: boolean
) {
  let ws = target instanceof WriteStream ? target : createWriteStream(target);
  return gzip === true ? createGzip().pipe(ws) : ws;
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
