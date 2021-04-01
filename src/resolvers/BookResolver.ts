import { Query, Resolver } from "type-graphql";
import { Book } from "../entities/Book";

const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
  {
    title: "Test 3",
    author: "Paul Auster",
  },
];

@Resolver()
export class BookResolver {
  @Query((returns) => [Book])
  async books() {
    return Promise.resolve(books);
  }
}
