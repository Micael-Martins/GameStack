import type { JogoBiblioteca } from "../models/JogoBiblioteca";
import {
  formatarHoras,
  formatarQuando,
  horasInteiras,
} from "../utils/formatarHoras.ts";

// Textos e decisões do CardJogo, sem React (testados no Node).

export interface DadosCardJogo {
  plataformaGenero: string; // "PC · RPG"
  textoHoras: string; // "12h de ~50h" | "ainda não começou" | "9h"
  linhaCompacta: string; // "PC · 18h de ~27h · ontem"
  mostrarBarra: boolean; // só Jogando com tempo médio > 0
  progresso: number; // 0 a 1 (estimativa pelo tempo médio da RAWG)
}

function primeiro(lista: string): string {
  return lista.split(",")[0]?.trim() ?? "";
}

export function prepararDadosCardJogo(
  item: JogoBiblioteca,
  agora: Date = new Date(),
): DadosCardJogo {
  const plataforma = item.jogo.plataformas[0] ?? "";
  const genero = primeiro(item.jogo.genero);
  const tempoMedio = Number.isFinite(item.jogo.tempoMedio)
    ? item.jogo.tempoMedio
    : 0;
  const temTempoMedio = tempoMedio > 0;

  let textoHoras: string;
  if (item.status === "NA_FILA") {
    textoHoras = "ainda não começou";
  } else if (item.status === "JOGANDO" && temTempoMedio) {
    textoHoras = `${horasInteiras(item.minutosJogados)}h de ~${tempoMedio}h`;
  } else {
    textoHoras = formatarHoras(item.minutosJogados);
  }

  const mostrarBarra = item.status === "JOGANDO" && temTempoMedio;
  const progresso = mostrarBarra
    ? Math.min(1, Math.max(0, item.minutosJogados / (tempoMedio * 60)))
    : 0;

  return {
    plataformaGenero: [plataforma, genero].filter(Boolean).join(" · "),
    textoHoras,
    linhaCompacta: [
      plataforma,
      textoHoras,
      formatarQuando(item.ultimaInteracao, agora),
    ]
      .filter(Boolean)
      .join(" · "),
    mostrarBarra,
    progresso,
  };
}
