import { Field, Int, ObjectType } from "type-graphql";

@ObjectType({ description: "Dados diarios dos fundos de investimento na CVM." })
export class FundoDiario {
  @Field((type) => Int, { description: "CNPJ do fundo" })
  cnpj: number;
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
  @Field((type) => Int, { description: "Tipo de fundo" })
  tipo: string;
}
