import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import { horasInteiras } from '../../../utils/formatarHoras.ts';

// Regras da tela Concluir jogo, sem React (testadas no Node).

// Texto que aparece embaixo das estrelas, para cada nota.
export const ROTULOS_NOTA = ['Não curti', 'Mais ou menos', 'Bom', 'Muito bom', 'Obra-prima'] as const;

export function textoNota(nota: number | null): string {
  if (nota === null || nota < 1 || nota > 5) return 'Toque nas estrelas para avaliar';
  return ROTULOS_NOTA[nota - 1];
}

// Próximo da fila: o jogo "Na fila" adicionado há mais tempo (o que espera há mais tempo).
export function proximoDaFila(jogos: JogoBiblioteca[], excluirId?: string): JogoBiblioteca | null {
  const fila = jogos.filter((item) => item.status === 'NA_FILA' && item.id !== excluirId);
  if (fila.length === 0) return null;
  return fila.reduce((maisAntigo, item) => (item.dataAdicao < maisAntigo.dataAdicao ? item : maisAntigo));
}

// Qual número de jogo zerado este vai ser: os já concluídos (sem contar ele) + 1.
export function numeroDoZerado(jogos: JogoBiblioteca[], idAtual: string): number {
  return jogos.filter((item) => item.status === 'CONCLUIDO' && item.id !== idAtual).length + 1;
}

// "48h jogadas · 3º jogo zerado"
export function linhaConclusao(minutosJogados: number, numero: number): string {
  return `${horasInteiras(minutosJogados)}h jogadas · ${numero}º jogo zerado`;
}
