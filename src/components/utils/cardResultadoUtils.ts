import type { Jogo } from '../../models/Jogo';
import { MESES } from '../../utils/formatarHoras.ts';

// Textos do CardResultado e do card da tela Adicionar, sem React (testados no Node).

function primeiroGenero(genero: string): string {
  return genero.split(',')[0]?.trim() ?? '';
}

// "Switch, Wii U": no máximo `limite` plataformas, para caber no card.
export function textoPlataformas(plataformas: string[], limite = 2): string {
  return plataformas.slice(0, limite).join(', ');
}

// "2017 · Switch, Wii U · Aventura" (pula o que estiver vazio).
export function linhaResultado(jogo: Jogo): string {
  return [jogo.anoLancamento ? String(jogo.anoLancamento) : '', textoPlataformas(jogo.plataformas), primeiroGenero(jogo.genero)]
    .filter(Boolean)
    .join(' · ');
}

// "Nintendo EPD · 2017" (tela Adicionar).
export function linhaDesenvolvedora(jogo: Jogo): string {
  return [jogo.desenvolvedora.split(',')[0]?.trim() ?? '', jogo.anoLancamento ? String(jogo.anoLancamento) : '']
    .filter(Boolean)
    .join(' · ');
}

// "Switch, Wii U · Aventura" (tela Adicionar).
export function linhaPlataformasGenero(jogo: Jogo): string {
  return [textoPlataformas(jogo.plataformas), primeiroGenero(jogo.genero)].filter(Boolean).join(' · ');
}

// "~50h em média"; vazio quando a RAWG não tem o tempo médio (0).
export function textoTempoMedio(tempoMedio: number): string {
  return Number.isFinite(tempoMedio) && tempoMedio > 0 ? `~${tempoMedio}h em média` : '';
}

// "Lançado em 03 mar 2017". A RAWG manda só a data ("2017-03-03"), sem hora:
// montamos o texto direto, sem passar por Date (que mudaria o dia por causa do fuso).
export function textoLancamento(data: string | null): string {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(data ?? '');
  if (!partes) return '';
  const [, ano, mes, dia] = partes;
  const nomeMes = MESES[Number(mes) - 1];
  return nomeMes ? `Lançado em ${dia} ${nomeMes} ${ano}` : '';
}
