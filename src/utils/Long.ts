import { GraphQLScalarType } from "graphql";

const Long = new GraphQLScalarType({
  name: "Long",
  description: "The `Long` scalar type represents 52-bit integers",
  parseValue: (value: any) =>
    value instanceof Number ? value : parseInt(value),
  parseLiteral: (ast: any) => parseInt(ast.value),
});

export default Long;
