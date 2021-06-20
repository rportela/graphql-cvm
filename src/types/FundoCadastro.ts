import { Field, ObjectType } from "type-graphql";
import Long from "../utils/Long";

@ObjectType({ description: "Dados cadastrais do fundo na CVM." })
export class FundoCadastro {
  @Field({ description: "Tipo de fundo." })
  tipo: string;
  @Field(() => Long, { description: "CNPJ do fundo." })
  cnpj: number;
  @Field({ description: "Denominação Social." })
  razao_social: string;
  @Field({ description: "Data de registro do fundo na CVM." })
  registro_data: Date;
  @Field({ description: "Data de constituição do fundo." })
  constituicao_data: Date;
  @Field({ description: "Código identificador do fundo na CVM." })
  codigo_cvm: number;
  @Field({ description: "Data de cancelamento do fundo." })
  cancelamento_data: Date;
  @Field({ description: "Situação atual do fundo." })
  situacao: string;
  @Field({ description: "Data de início da situação do fundo." })
  situacao_data: Date;
  @Field({ description: "Data de início da atividade do fundo." })
  atividade_inicio: Date;
  @Field({ description: "Data de início do último exercício social do fundo." })
  exercicio_inicio: Date;
  @Field({
    description: "Data de término do último exercício social do fundo.",
  })
  exercicio_fim: Date;
  @Field({ description: "Classificação do fundo." })
  classe: string;
  @Field({ description: "Data de início da classificação do fundo." })
  classe_inicio: Date;
  @Field({
    description: "Forma de rentabilidade do fundo (indicador de desempenho).",
  })
  rentabilidade: string;
  @Field({ description: "Forma de condomínio (Aberto/Fechado)." })
  condominio: string;
  @Field({ description: "Indica se é fundo de cotas." })
  fundo_cotas: boolean;
  @Field({ description: "Indica se é fundo exclusivo." })
  fundo_exclusivo: boolean;
  @Field({ description: "Indica se possui tributação de longo prazo." })
  tributacao_longo_prazo: boolean;
  @Field({ description: "Indica se é restrito a investidores qualificados." })
  investidores_qualificados: boolean;
  @Field({ description: "Indica se é entidade de investimento." })
  entidade_de_investimento: boolean;
  @Field({ description: "Taxa de performance." })
  taxa_performance: number;
  @Field({ description: "Descrição da taxa de performance." })
  taxa_performance_info: string;
  @Field({ description: "Taxa de administração." })
  taxa_adm: number;
  @Field({ description: "Descrição da taxa de administração." })
  taxa_adm_info: string;
  @Field({ description: "Valor do patrimônio líquido do fundo." })
  pl_valor: number;
  @Field({
    description: "Data do patrimônio líquido do fundo.",
    nullable: true,
  })
  pl_data?: Date;
  @Field({ description: "Nome do diretor do fundo.", nullable: true })
  diretor_nome?: string;
  @Field({ description: "CNPJ do administrador do fundo.", nullable: true })
  admin_cnpj?: number;
  @Field({ description: "Nome do administrador do fundo.", nullable: true })
  admin_nome?: string;
  @Field({ description: "Indica se o gestor é pessoa física.", nullable: true })
  gestor_pf?: boolean;
  @Field({ description: "CPF ou CNPJ do gestor do fundo.", nullable: true })
  gestor_cnpj?: number;
  @Field({ description: "Nome do gestor do fundo.", nullable: true })
  gestor_nome?: string;
  @Field({ description: "CNPJ do auditor do fundo.", nullable: true })
  auditor_cnpj?: number;
  @Field({ description: "Nome do auditor do fundo.", nullable: true })
  auditor_nome?: string;
  @Field({ description: "CNPJ do custodiante do fundo.", nullable: true })
  custodiante_cnpj?: number;
  @Field({ description: "Nome do custodiante do fundo.", nullable: true })
  custodiante_nome?: string;
  @Field({ description: "CNPJ do controlador do fundo.", nullable: true })
  controlador_cnpj?: number;
  @Field({ description: "Nome do controlador do fundo.", nullable: true })
  controlador_nome?: string;
  @Field({ description: "Data de extração da informação.", nullable: true })
  extraido_em: Date;
}
