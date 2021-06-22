import {
  createReadStream,
  createWriteStream, readdirSync,
  ReadStream,
  Stats,
  statSync,
  WriteStream
} from "fs";
import { resolve } from "path";
import { createGunzip, createGzip, Gunzip } from "zlib";
import { ensureDirs } from "../utils/Files";

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



}
