import "reflect-metadata";
import { ApolloServer } from "apollo-server";
import { buildTypeDefsAndResolvers } from "type-graphql";

const typeGql = buildTypeDefsAndResolvers({
  resolvers: [
    __dirname + "/entities/**/*.{ts,js}",
    __dirname + "/resolvers/**/*.{ts,js}",
  ],
});

typeGql.then((tq) => {
  // The ApolloServer constructor requires two parameters: your schema
  // definition and your set of resolvers.
  const server = new ApolloServer({
    typeDefs: tq.typeDefs,
    resolvers: tq.resolvers,
  });

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });
});
