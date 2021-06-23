import { Field, ObjectType } from "type-graphql";
import { FundoCarteiraItem } from "./FundoCarteiraItem";

@ObjectType("SWAP")
export class FundoCarteiraItemSwap extends FundoCarteiraItem {
  @Field({ description: "Código SWAP" })
  swap_codigo: string;

  @Field({ description: "Descrição do tipo de ativo SWAP" })
  swap_descricao: string;
}
