import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';

export interface DadosCardJogo {
  resumo: string;
  tempoJogado: string;
  temTempoMedio: boolean;
  progresso: number;
  percentual: number | null;
}

/** Converte os minutos registrados em um texto legível. */
export function formatarTempoJogado(minutos: number): string {
  const total = Number.isFinite(minutos)
    ? Math.max(0, Math.floor(minutos))
    : 0;

  const horas = Math.floor(total / 60);
  const restantes = total % 60;

  if (horas === 0) {
    return `${restantes} min`;
  }

  if (restantes === 0) {
    return `${horas} h`;
  }

  return `${horas} h ${restantes} min`;
}

/**
 * Prepara os dados usados pelas duas variantes do CardJogo.
 * A RAWG informa playtime em horas; a biblioteca registra minutos.
 */
export function prepararDadosCardJogo(
  item: JogoBiblioteca,
): DadosCardJogo {
  const minutosJogados = Number.isFinite(item.minutosJogados)
    ? Math.max(0, item.minutosJogados)
    : 0;

  const horasMedias = item.jogo.tempoMedio;

  const temTempoMedio =
    Number.isFinite(horasMedias) && horasMedias > 0;

  const minutosMedios = temTempoMedio ? horasMedias * 60 : 0;

  const progresso = temTempoMedio
    ? Math.min(1, Math.max(0, minutosJogados / minutosMedios))
    : 0;

  const genero = item.jogo.genero.trim();
  const plataforma = item.jogo.plataformas[0] ?? '';

  const resumo =
    genero ||
    plataforma ||
    (item.jogo.anoLancamento
      ? String(item.jogo.anoLancamento)
      : '');

  return {
    resumo,
    tempoJogado: formatarTempoJogado(minutosJogados),
    temTempoMedio,
    progresso,
    percentual: temTempoMedio
      ? Math.round(progresso * 100)
      : null,
  };
}
