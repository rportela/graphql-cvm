import { Field } from "type-graphql";

export abstract class FundoCarteiraItem {
  @Field({ description: "CNPJ do fundo" })
  cnpj: number;

  /*@Field({ description: "Denominação Social" })
  razao_social: string;*/
  @Field({ description: "Data de competência do documento" })
  competencia: Date;

  @Field({ description: "Prazo de confidencialidade da aplicação" })
  prazo_confidencialidade: Date;

  @Field({
    description:
      "Indica se o emissor da aplicação é ligado ao gestor ou administrador do fundo de investimento",
  })
  emissor_ligado: boolean;

  @Field({
    description: "Quantidade de aquisições dos negócios realizados no mês",
  })
  compra_qtde: number;

  @Field({ description: "Quantidade da posição final" })
  posicao_qtde: number;

  @Field({ description: "Quantidade de vendas dos negócios realizados no mês" })
  venda_qtde: number;

  @Field({ description: "Tipo de aplicação" })
  aplicacao_tipo: string;

  @Field({ description: "Tipo de ativo" })
  ativo_tipo: string;

  @Field({ description: "Tipo de fundo" })
  fundo_tipo: string;

  @Field({ description: "Tipo de negociação" })
  negociacao_tipo: string;

  @Field({ description: "Valor das aquisições dos negócios realizados no mês" })
  compra_valor: number;

  @Field({ description: "Valor de custo da posição final" })
  posicao_custo: number;

  @Field({ description: "Valor de mercado da posição final" })
  posicao_valor: number;

  @Field({ description: "Valor das vendas dos negócios realizados no mês" })
  venda_valor: number;

  @Field({ description: "Data da extração da informação." })
  extracao_data: Date;
}
