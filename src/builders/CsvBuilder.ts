export interface CsvBuilderEntry<T> {
  (value: string, target: T): void;
}

export class CsvBuilder<T> {
  build(row: string[], headers: string[]): T {
    const entity = {};
    for (let i = 0; i < headers.length; i++) {
      const key = headers[i];
      const mapping: CsvBuilderEntry<T> = this[key];
      if (mapping) {
        mapping(row[i], entity as T);
      }
    }
    return entity as T;
  }
}
