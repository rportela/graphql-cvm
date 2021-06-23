import { Field, ObjectType } from "type-graphql";
import { FundoCarteiraItem } from "./FundoCarteiraItem";

@ObjectType({ description: "DEMAIS ATIVOS CODIFICADOS" })
export class FundoCarteiraItemAtivoCodificado extends FundoCarteiraItem {
  @Field({ description: "Código do ativo" })
  ativo_codigo: string;
  @Field({ description: "Descrição do ativo" })
  ativo_descricao: string;
  @Field({
    description: "Código ISIN (International Securities Identification Number)",
  })
  isin: string;
  @Field({ description: "Data início da vigência" })
  vigencia_inicio: Date;
  @Field({ description: "Data fim da vigência" })
  vigencia_fim: Date;
}
