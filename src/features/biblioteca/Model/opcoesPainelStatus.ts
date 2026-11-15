import type { StatusJogo } from '../../../models/StatusJogo';

export interface OpcaoPainelStatus {
  status: StatusJogo;
  titulo: string;
  descricao: string;
}

export const OPCOES_PAINEL_STATUS: OpcaoPainelStatus[] = [
  {
    status: 'NA_FILA',
    titulo: 'Na fila',
    descricao: 'Quero jogar futuramente.',
  },
  {
    status: 'JOGANDO',
    titulo: 'Jogando',
    descricao: 'Estou jogando atualmente.',
  },
  {
    status: 'CONCLUIDO',
    titulo: 'Concluído',
    descricao: 'Terminei este jogo.',
  },
  {
    status: 'ABANDONADO',
    titulo: 'Abandonado',
    descricao: 'Parei de jogar.',
  },
];

export function aceitaAvaliacao(status: StatusJogo): boolean {
  return status === 'CONCLUIDO' || status === 'ABANDONADO';
}

export function podeSalvarStatus(
  statusAtual: StatusJogo,
  statusSelecionado: StatusJogo,
): boolean {
  return statusAtual !== statusSelecionado;
}

export function notaParaMudanca(
  status: StatusJogo,
  nota: number | null,
): number | undefined {
  return aceitaAvaliacao(status) && nota !== null
    ? nota
    : undefined;
}
