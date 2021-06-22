import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  ReadStream,
  Stats,
  statSync,
  WriteStream,
} from "fs";
import fetch from "node-fetch";
import { resolve } from "path";
import readline from "readline";
import { createGunzip, createGzip, Gunzip } from "zlib";
import { readCsv } from "../utils/Files";
import { ensureDirs } from "../utils/Files";
import { fileNameFromUrl } from "../utils/Parsers";

const LOCAL_PATH = ".data";

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
 * This class is responsible for IO in a specific data folder.
 */
export class DataFolder {
  gzip: boolean;
  name: string;
  folder: string;
  encoding?: BufferEncoding;

  /**
   * A constructor that enables to tell some properties of the data folder.
   * A directory will be created at this point.
   *
   * @param name
   * @param gzip
   * @param parent
   */
  constructor(
    name: string,
    gzip: boolean = false,
    parent: string = LOCAL_PATH
  ) {
    this.name = name;
    this.gzip = gzip;
    this.folder = resolve(parent, name);
    console.log(__dirname, parent, name, this.folder);
    ensureDirs(this.folder);
  }

  /**
   * This method lists all entries, be it files or folders in the data folder.
   *
   * @returns
   */
  listEntries(): string[] {
    return readdirSync(this.folder);
  }

  /**
   * This method resolves a file name to a path. It will append gz if the appropriate flag is set.
   *
   * @param fileName
   * @returns
   */
  getFilePath(fileName: string): string {
    if (this.gzip === true && !fileName.endsWith(".gz")) fileName += ".gz";
    return resolve(this.folder, fileName);
  }

  /**
   * This method creates a read stream from a filename in this data folder that may or may not be gzipped depending on a flag.
   * Optionally you can set an encoding to read from.
   *
   * @param fileName
   * @returns
   */
  getReadStream(fileName: string): ReadStream | Gunzip {
    let rs: ReadStream | Gunzip = createReadStream(this.getFilePath(fileName));
    if (this.gzip) rs = rs.pipe(createGunzip());
    if (this.encoding) rs.setEncoding(this.encoding);
    return rs;
  }

  /**
   * This method creates a write stream to a specific filename, gzipped or not depending on the flag,
   * and with a particular, optional, encoding.
   *
   * @param fileName
   * @returns
   */
  getWriteStream(fileName: string): WriteStream {
    const ws = createWriteStream(this.getFilePath(fileName));
    return this.gzip ? createGzip().pipe(ws) : ws;
  }

  /**
   * Gets file statistics.
   *
   * @param fileName
   * @returns
   */
  getStats(fileName: string): Stats {
    return statSync(this.getFilePath(fileName));
  }

  /**
   * This method simply downloads from an url and may decide the file name if none is provided.
   *
   * @param url
   * @param fileName
   * @returns
   */
  async download(url: string, fileName?: string): Promise<void> {
    return fetch(url)
      .then((res) => res.body)
      .then(
        (body) =>
          new Promise((resolve, reject) => {
            if (!fileName) fileName = fileNameFromUrl(url);
            body
              .pipe(this.getWriteStream(fileName))
              .on("close", resolve)
              .on("error", reject);
          })
      );
  }

  /**
   * This method reads a file line by line.
   * You should provide a visitor that returns true if the next line should be read
   * or false if no more lines should be read.
   *
   * @param fileName
   * @param visit
   * @returns
   */
  async forEachLine(fileName: string, visit: LineVisitor): Promise<number> {
    let lineNumber = 0;
    const rl = readline.createInterface({
      input: this.getReadStream(fileName),
    });

    for await (const line of rl) {
      if (!visit(line, lineNumber)) break;
      lineNumber++;
    }

    rl.close();
    return lineNumber;
  }

  /**
   * This method parses a CSV file using the encoding set on this data folder class.
   * You should provide the separator and a visitor that returns true if more lines should be read or false otherwise.
   * Optionally you can specify if the first row has headers or not.
   *
   * @param fileName
   * @param separator
   * @param visit
   * @param headerRow
   * @returns
   */
  async forEachCsvRow(
    fileName: string,
    separator: string,
    visit: CsvVisitor,
    headerRow = true
  ): Promise<number> {
    let headers: string[];
    const visitor = (line: string, lineNumber: number): boolean => {
      const row = line.split(separator);
      if (headerRow === true && lineNumber === 0) {
        headers = row;
        return true;
      } else return visit(row, lineNumber, headers);
    };
    return await this.forEachLine(fileName, visitor);
  }
}
