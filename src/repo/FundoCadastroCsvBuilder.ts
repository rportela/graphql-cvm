import { FundoCadastro } from "../types/FundoCadastro";
import { dateYmd, digitsOnly } from "../utils/Parsers";

export class FundoCadastroCsvBuilder {
  TP_FUNDO = (value: string, target: FundoCadastro): void => {
    target.tipo = value;
  };
  CNPJ_FUNDO = (value: string, target: FundoCadastro): void => {
    target.cnpj = digitsOnly(value);
  };
  DENOM_SOCIAL = (value: string, target: FundoCadastro): void => {
    target.razao_social = value;
  };
  DT_REG = (value: string, target: FundoCadastro): void => {
    target.registro_data = dateYmd(value);
  };
  DT_CONST = (value: string, target: FundoCadastro): void => {
    target.constituicao_data = dateYmd(value);
  };
  CD_CVM = (value: string, target: FundoCadastro): void => {
    target.codigo_cvm = digitsOnly(value);
  };
  DT_CANCEL = (value: string, target: FundoCadastro): void => {
    target.cancelamento_data = dateYmd(value);
  };
  SIT = (value: string, target: FundoCadastro): void => {
    target.situacao = value;
  };
  DT_INI_SIT = (value: string, target: FundoCadastro): void => {
    target.situacao_data = dateYmd(value);
  };
  DT_INI_ATIV = (value: string, target: FundoCadastro): void => {
    target.atividade_inicio = dateYmd(value);
  };
  DT_INI_EXERC = (value: string, target: FundoCadastro): void => {
    target.exercicio_inicio = dateYmd(value);
  };
  DT_FIM_EXERC = (value: string, target: FundoCadastro): void => {
    target.exercicio_fim = dateYmd(value);
  };
  CLASSE = (value: string, target: FundoCadastro): void => {
    target.classe = value;
  };
  DT_INI_CLASSE = (value: string, target: FundoCadastro): void => {
    target.classe_inicio = dateYmd(value);
  };
  RENTAB_FUNDO = (value: string, target: FundoCadastro): void => {
    target.rentabilidade = value;
  };
  CONDOM = (value: string, target: FundoCadastro): void => {
    target.condominio = value;
  };
  FUNDO_COTAS = (value: string, target: FundoCadastro): void => {
    target.fundo_cotas = value === "S";
  };
  FUNDO_EXCLUSIVO = (value: string, target: FundoCadastro): void => {
    target.fundo_exclusivo = value === "S";
  };
  TRIB_LPRAZO = (value: string, target: FundoCadastro): void => {
    target.tributacao_longo_prazo = value === "S";
  };
  INVEST_QUALIF = (value: string, target: FundoCadastro): void => {
    target.investidores_qualificados = value === "S";
  };
  ENTID_INVEST = (value: string, target: FundoCadastro): void => {
    target.entidade_de_investimento = value === "S";
  };
  TAXA_PERFM = (value: string, target: FundoCadastro): void => {
    target.taxa_performance = value ? parseFloat(value) : 0.0;
  };
  INF_TAXA_PERFM = (value: string, target: FundoCadastro): void => {
    target.taxa_performance_info = value;
  };
  TAXA_ADM = (value: string, target: FundoCadastro): void => {
    target.taxa_adm = value ? parseFloat(value) : 0.0;
  };
  INF_TAXA_ADM = (value: string, target: FundoCadastro): void => {
    target.taxa_adm_info = value;
  };
  VL_PATRIM_LIQ = (value: string, target: FundoCadastro): void => {
    target.pl_valor = value ? parseFloat(value) : 0.0;
  };
  DT_PATRIM_LIQ = (value: string, target: FundoCadastro): void => {
    target.pl_data = dateYmd(value);
  };
  DIRETOR = (value: string, target: FundoCadastro): void => {
    target.diretor_nome = value;
  };
  CNPJ_ADMIN = (value: string, target: FundoCadastro): void => {
    target.admin_cnpj = digitsOnly(value);
  };
  ADMIN = (value: string, target: FundoCadastro): void => {
    target.admin_nome = value;
  };
  PF_PJ_GESTOR = (value: string, target: FundoCadastro): void => {
    target.gestor_pf = value === "PF";
  };
  CPF_CNPJ_GESTOR = (value: string, target: FundoCadastro): void => {
    target.gestor_cnpj = digitsOnly(value);
  };
  GESTOR = (value: string, target: FundoCadastro): void => {
    target.gestor_nome = value;
  };
  CNPJ_AUDITOR = (value: string, target: FundoCadastro): void => {
    target.auditor_cnpj = digitsOnly(value);
  };
  AUDITOR = (value: string, target: FundoCadastro): void => {
    target.auditor_nome = value;
  };
  CNPJ_CUSTODIANTE = (value: string, target: FundoCadastro): void => {
    target.custodiante_cnpj = digitsOnly(value);
  };
  CUSTODIANTE = (value: string, target: FundoCadastro): void => {
    target.custodiante_nome = value;
  };
  CNPJ_CONTROLADOR = (value: string, target: FundoCadastro): void => {
    target.controlador_cnpj = digitsOnly(value);
  };
  CONTROLADOR = (value: string, target: FundoCadastro): void => {
    target.controlador_nome = value;
  };

  build = (row: string[], headers: string[]): FundoCadastro => {
    const fd = new FundoCadastro();
    fd.extraido_em = new Date();
    for (let i = 0; i < headers.length; i++) {
      const mapping = this[headers[i]];
      if (mapping) {
        mapping(row[i], fd);
      }
    }
    return fd;
  };
}
