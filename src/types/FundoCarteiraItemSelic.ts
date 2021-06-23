import { Field, ObjectType } from "type-graphql";
import { FundoCarteiraItem } from "./FundoCarteiraItem";

@ObjectType("TÍTULOS PÚBLICOS DO SELIC")
export class FundoCarteiraItemSelic extends FundoCarteiraItem {
  @Field({
    description: "Código ISIN (International Securities Identification Number)",
  })
  isin: string;

  @Field({ description: "Código SELIC" })
  selic_id: number;

  @Field({ description: "Data de emissão" })
  emissao: Date;

  @Field({ description: "Data de vencimento" })
  vencimento: Date;

  @Field({ description: "Tipo de título público" })
  tit_publico_tipo: string;
}
