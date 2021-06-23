import { Field, Int, ObjectType } from "type-graphql";
import Long from "../utils/Long";

@ObjectType({ description: "Dados diarios dos fundos de investimento na CVM." })
export class FundoDiario {
  @Field(() => Long, { description: "CNPJ do fundo", nullable: true })
  cnpj?: number;
  @Field({ description: "Data de competência do documento" })
  competencia: Date;
  @Field({ description: "Valor da cota" })
  cota: number;
  @Field({ description: "Valor do patrimônio líquido" })
  pl: number;
  @Field({ description: "Valor total da carteira" })
  carteira: number;
  @Field({ description: "Resgate no dia" })
  resgates: number;
  @Field({ description: "Captação do dia" })
  captacao: number;
  @Field({ description: "Número de cotistas" })
  cotistas: number;
  @Field(() => String, { description: "Tipo de fundo", nullable: true })
  tipo?: string;
  @Field({ description: "A data da extração" })
  extraido_em: Date;
}
