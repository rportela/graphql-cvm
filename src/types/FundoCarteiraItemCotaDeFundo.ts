import { Field, ObjectType } from "type-graphql";
import { FundoCarteiraItem } from "./FundoCarteiraItem";

@ObjectType({ description: "COTAS DE FUNDOS DE INVESTIMENTO" })
export class FundoCarteiraItemCotaDeFundo extends FundoCarteiraItem {
  @Field({ description: "CNPJ do fundo investido" })
  investido_cnpj;

  @Field({ description: "Denominação social do fundo investido" })
  investido_nome;
}
