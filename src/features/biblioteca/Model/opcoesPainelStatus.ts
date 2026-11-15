import type { StatusJogo } from '../../../models/StatusJogo';

export interface OpcaoPainelStatus {
  status: StatusJogo;
  titulo: string;
  descricao: string;
  destaque?: boolean; // "Concluir jogo" aparece em branco
}

// Textos do cartão "Painel Mudar status", na ordem do protótipo.
export const OPCOES_PAINEL_STATUS: OpcaoPainelStatus[] = [
  {
    status: 'NA_FILA',
    titulo: 'Voltar para a fila',
    descricao: 'Guardar para jogar depois.',
  },
  {
    status: 'JOGANDO',
    titulo: 'Jogando',
    descricao: 'Estou jogando agora.',
  },
  {
    status: 'CONCLUIDO',
    titulo: 'Concluir jogo',
    descricao: 'Terminei! Dar nota e registrar.',
    destaque: true,
  },
  {
    status: 'ABANDONADO',
    titulo: 'Abandonar',
    descricao: 'Parei e não vou continuar.',
  },
];

// O que acontece ao tocar numa opção:
// - 'nada': é o status atual (já marcado com check)
// - 'concluir': fecha o painel e abre a tela Concluir jogo (para nunca pular a nota)
// - 'mudar': muda o status na hora
export type AcaoOpcaoStatus = 'nada' | 'concluir' | 'mudar';

export function acaoDaOpcao(statusAtual: StatusJogo, escolhido: StatusJogo): AcaoOpcaoStatus {
  if (statusAtual === escolhido) return 'nada';
  if (escolhido === 'CONCLUIDO') return 'concluir';
  return 'mudar';
}

// Texto da linha "Agora: ..." no topo do painel.
const NOMES_STATUS: Record<StatusJogo, string> = {
  NA_FILA: 'Na fila',
  JOGANDO: 'Jogando',
  CONCLUIDO: 'Concluído',
  ABANDONADO: 'Abandonado',
};

export function nomeDoStatus(status: StatusJogo): string {
  return NOMES_STATUS[status];
}