
import { ObjectType, Field } from "type-graphql";

@ObjectType({ description: "The book model" })
export class Book {
  @Field()
  title: string;
  @Field()
  author: string;
}
