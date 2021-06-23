import { Field, ObjectType } from "type-graphql";
import { FundoCadastro } from "./FundoCadastro";
import { FundoDiario } from "./FundoDiario";

@ObjectType({ description: "Dados Completos do fundo" })
export class FundoCompleto {
  @Field(() => FundoCadastro!, { description: "Dados de cadastro do fundo" })
  cadastro: FundoCadastro;
  @Field(() => [FundoCadastro!], {
    description: "Dados de historicos do cadastro do fundo",
  })
  historico: FundoCadastro[];
  @Field(() => [FundoDiario!], { description: "Dados diarios do fundo" })
  diario: FundoDiario[];
}
