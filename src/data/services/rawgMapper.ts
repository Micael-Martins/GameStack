import type { Jogo } from '../../models/Jogo';
import type { RawgJogo } from '../../models/RawgJogo';

export function converterRawgParaJogo(rawg: RawgJogo): Jogo {
  const ano = typeof rawg.released === 'string'
    ? Number.parseInt(rawg.released.slice(0, 4), 10)
    : NaN;

  const generos = Array.isArray(rawg.genres)
    ? rawg.genres.map((item) => item.name).filter(Boolean)
    : [];

  const plataformas = Array.isArray(rawg.platforms)
    ? rawg.platforms
        .map((item) => item.platform?.name)
        .filter((nome): nome is string => Boolean(nome))
    : [];

  return {
    id: `rawg-${rawg.id}`,
    apiId: String(rawg.id),
    origemAPI: 'RAWG',
    nome: rawg.name,
    imagemURL: rawg.background_image ?? null,
    genero: generos.join(', '),
    desenvolvedora: Array.isArray(rawg.developers)
      ? rawg.developers.map((item) => item.name).filter(Boolean).join(', ')
      : '',
    anoLancamento: Number.isFinite(ano) ? ano : null,
    tempoMedio:
      typeof rawg.playtime === 'number' &&
      Number.isFinite(rawg.playtime)
        ? Math.max(0, rawg.playtime)
        : 0,
    plataformas,
  };
}
export interface SobreJogo {
  descricao: string;
  metacritic: number | null;
  dataLancamento: string | null; // "2017-03-03", como a RAWG manda
}

export interface DetalhesJogoRawg extends Jogo {
  sobre: SobreJogo;
}

// A descrição da RAWG às vezes vem com o texto repetido em espanhol no final.
export function extrairSobre(rawg: Partial<RawgJogo>): SobreJogo {
  const descricao = (rawg.description_raw ?? '').split(/\n+Español\b/)[0].trim();
  const metacritic =
    typeof rawg.metacritic === 'number' && Number.isFinite(rawg.metacritic) && rawg.metacritic > 0
      ? rawg.metacritic
      : null;
  return { descricao, metacritic, dataLancamento: rawg.released ?? null };
}
