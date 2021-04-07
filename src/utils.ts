import { GraphQLScalarType } from "graphql";

export function digitsOnly(input: string): number | null {
  if (!input) return null;
  return parseInt(input.replace(/\D/g, ""));
}

export function dateYmd(input: string): Date | null {
  if (!input) return null;
  const spl = input.split("-");
  return new Date(parseInt(spl[0]), parseInt(spl[1]) - 1, parseInt(spl[2]));
}

export const Long = new GraphQLScalarType({
  name: "Long",
  description: "The `Long` scalar type represents 52-bit integers",
  parseValue: (value: any) =>
    value instanceof Number ? value : parseInt(value),
  parseLiteral: (ast: any) => parseInt(ast.value),
});
