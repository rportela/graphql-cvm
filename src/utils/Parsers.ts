export function digitsOnly(input: string): number | null {
  if (!input) return null;
  return parseInt(input.replace(/\D/g, ""));
}

export function dateYmd(input: string): Date | null {
  if (!input) return null;
  const spl = input.split("-");
  return new Date(parseInt(spl[0]), parseInt(spl[1]) - 1, parseInt(spl[2]));
}

export function buildFromMapping<T>(
  constructor: () => T,
  headers: string[],
  row: string[],
  mapping: (value: string, target: T) => void
): T {
  const entry = constructor();
  entry["extraido_em"] = new Date();
  for (let i = 0; i < headers.length; i++) {
    const mapped = mapping[headers[i]];
    if (mapped) {
      mapped(row[i], entry);
    }
  }
  return entry;
}
