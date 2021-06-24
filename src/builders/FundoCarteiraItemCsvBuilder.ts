import { FundoCarteiraItem } from "../types/FundoCarteiraItem";
import { dateYmd, digitsOnly } from "../utils/Parsers";
import { CsvBuilder } from "./CsvBuilder";

export class FundoCarteiraCsvBuilder<
  T extends FundoCarteiraItem
  > extends CsvBuilder<T> {
  CNPJ_FUNDO = (value: string, target: T) => {
    target.cnpj = digitsOnly(value);
  };

  /*
    DENOM_SOCIAL = (value: string, target: T) => {
        target.razao_social = value;
    };*/

  DT_COMPTC = (value: string, target: T) => {
    target.competencia = dateYmd(value);
  };

  DT_CONFID_APLIC = (value: string, target: T) => {
    target.prazo_confidencialidade = dateYmd(value);
  };

  EMISSOR_LIGADO = (value: string, target: T) => {
    target.emissor_ligado = value === "S";
  };

  QT_AQUIS_NEGOC = (value: string, target: T) => {
    target.compra_qtde = Number(value);
  };

  QT_POS_FINAL = (value: string, target: T) => {
    target.posicao_qtde = Number(value);
  };

  QT_VENDA_NEGOC = (value: string, target: T) => {
    target.venda_qtde = Number(value);
  };

  TP_APLIC = (value: string, target: T) => {
    target.aplicacao_tipo = value;
  };

  TP_ATIVO = (value: string, target: T) => {
    target.ativo_tipo = value;
  };

  TP_FUNDO = (value: string, target: T) => {
    target.fundo_tipo = value;
  };

  TP_NEGOC = (value: string, target: T) => {
    target.negociacao_tipo = value;
  };

  VL_AQUIS_NEGOC = (value: string, target: T) => {
    target.compra_valor = Number(value);
  };

  VL_CUSTO_POS_FINAL = (value: string, target: T) => {
    target.posicao_custo = Number(value);
  };

  VL_MERC_POS_FINAL = (value: string, target: T) => {
    target.posicao_valor = Number(value);
  };

  VL_VENDA_NEGOC = (value: string, target: T) => {
    target.venda_valor = Number(value);
  };

  build(row: string[], headers: string[]): T {
    const entity = super.build(row, headers);
    entity.extracao_data = new Date();
    return entity;
  }
}
