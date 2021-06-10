import { F_OK } from "constants";
import { PathLike } from "fs";
import { access, readFile } from "fs/promises";
import { writeFile } from "node:fs";
import { gzip } from "node:zlib";
import { unzip } from "zlib";

export function fileExists(path: PathLike): Promise<void> {
  return access(path, F_OK);
}

export function jsonGunzip<T>(path: PathLike): Promise<T> {
  return new Promise((resolve, reject) => {
    readFile(path).then((buf) =>
      unzip(buf, (err, data) => {
        if (err) reject(err);
        else resolve(JSON.parse(data.toString()));
      })
    );
  });
}

export function jsonGzip(path: PathLike, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const gz = gzip(content, (err, buf) => {
      if (err) reject(err);
      writeFile(path, buf, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}
