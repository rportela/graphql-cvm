import { ApolloServer } from "apollo-server-express";
import express from "express";
import { Server } from "node:http";
import "reflect-metadata";
import { buildTypeDefsAndResolvers } from "type-graphql";
//import { authMiddleware } from "./authentication";

async function createApolloServer(): Promise<ApolloServer> {
  return buildTypeDefsAndResolvers({
    resolvers: [
      __dirname + "/entities/**/*.{ts,js}",
      __dirname + "/resolvers/**/*.{ts,js}",
    ],
  }).then(
    (tq) => new ApolloServer({ typeDefs: tq.typeDefs, resolvers: tq.resolvers })
  );
}

async function connectToExpress(server: ApolloServer): Promise<Server> {
  return new Promise((resolve, reject) => {
    try {
      const app = express();
      //    app.use("*", authMiddleware);
      server.applyMiddleware({ app });
      resolve(app.listen({ port: 4000 }));
    } catch (e) {
      reject(e);
    }
  });
}

async function informSuccess(server: Server) {
  console.log(
    `🚀 Server ready at ${server.address()}/${server["graphqlPath"]}`
  );
}

export default async function run() {
  await createApolloServer().then(connectToExpress).then(informSuccess);
}

run();
