import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { StatusJogo } from '../../../models/StatusJogo';
import { horasInteiras } from '../../../utils/formatarHoras.ts';

// Regras da tela Biblioteca, sem React (testadas no Node).

export type FiltroBiblioteca = 'TODOS' | StatusJogo;

// Chips na ordem do protótipo.
export const FILTROS: { filtro: FiltroBiblioteca; rotulo: string }[] = [
  { filtro: 'TODOS', rotulo: 'Todos' },
  { filtro: 'JOGANDO', rotulo: 'Jogando' },
  { filtro: 'NA_FILA', rotulo: 'Na fila' },
  { filtro: 'CONCLUIDO', rotulo: 'Concluídos' },
  { filtro: 'ABANDONADO', rotulo: 'Abandonados' },
];

// O AsyncStorage guarda texto: se vier algo que não é filtro (ou vazio), volta para "Todos".
export function filtroValido(texto: string | null | undefined): FiltroBiblioteca {
  return FILTROS.some((item) => item.filtro === texto) ? (texto as FiltroBiblioteca) : 'TODOS';
}

// A lista já vem da store ordenada pela última sessão; aqui só filtra.
export function filtrarJogos(jogos: JogoBiblioteca[], filtro: FiltroBiblioteca): JogoBiblioteca[] {
  return filtro === 'TODOS' ? jogos : jogos.filter((item) => item.status === filtro);
}

// Número que aparece em cada chip.
export function contagemPorFiltro(jogos: JogoBiblioteca[]): Record<FiltroBiblioteca, number> {
  const contagem: Record<FiltroBiblioteca, number> = { TODOS: jogos.length, NA_FILA: 0, JOGANDO: 0, CONCLUIDO: 0, ABANDONADO: 0 };
  for (const item of jogos) contagem[item.status] += 1;
  return contagem;
}

// "8 jogos · 248h registradas"
export function textoResumo(jogos: JogoBiblioteca[]): string {
  const minutos = jogos.reduce((soma, item) => soma + item.minutosJogados, 0);
  const quantidade = jogos.length === 1 ? '1 jogo' : `${jogos.length} jogos`;
  return `${quantidade} · ${horasInteiras(minutos)}h registradas`;
}
