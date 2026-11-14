import type { Jogo } from '../models/Jogo';
import type { RawgJogo } from '../models/RawgJogo';

const RAWG_URL = 'https://api.rawg.io/api';
const TEMPO_LIMITE_MS = 10000;

interface RespostaRawg {
  count: number;
  next: string | null;
  results: RawgJogo[];
}

export interface OpcoesBuscaRawg {
  pagina?: number;
  limite?: number;
  chave?: string;
  signal?: AbortSignal;
  fetcher?: typeof fetch;
}

export interface ResultadoBuscaRawg {
  jogos: Jogo[];
  total: number;
  pagina: number;
  temProximaPagina: boolean;
}

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
    desenvolvedora: '',
    anoLancamento: Number.isFinite(ano) ? ano : null,
    tempoMedio:
      typeof rawg.playtime === 'number' &&
      Number.isFinite(rawg.playtime)
        ? Math.max(0, rawg.playtime)
        : 0,
    plataformas,
  };
}

export async function buscarJogosRawg(
  termo: string,
  opcoes: OpcoesBuscaRawg = {},
): Promise<ResultadoBuscaRawg> {
  const pesquisa = termo.trim();
  const pagina = opcoes.pagina ?? 1;
  const limite = opcoes.limite ?? 20;

  if (!Number.isInteger(pagina) || pagina < 1) {
    throw new Error('RAWG: página inválida.');
  }

  if (!Number.isInteger(limite) || limite < 1 || limite > 40) {
    throw new Error('RAWG: o limite deve estar entre 1 e 40.');
  }

  if (!pesquisa) {
    return {
      jogos: [],
      total: 0,
      pagina,
      temProximaPagina: false,
    };
  }

  const chave = (
    opcoes.chave ?? process.env.EXPO_PUBLIC_RAWG_KEY ?? ''
  ).trim();

  if (!chave) {
    throw new Error('RAWG: chave da API não configurada.');
  }

  const url =
    `${RAWG_URL}/games` +
    `?key=${encodeURIComponent(chave)}` +
    `&search=${encodeURIComponent(pesquisa)}` +
    `&page=${pagina}` +
    `&page_size=${limite}`;

  const controller = new AbortController();
  let tempoEsgotado = false;

  const cancelar = () => controller.abort();

  if (opcoes.signal?.aborted) {
    controller.abort();
  } else {
    opcoes.signal?.addEventListener('abort', cancelar);
  }

  const temporizador = setTimeout(() => {
    tempoEsgotado = true;
    controller.abort();
  }, TEMPO_LIMITE_MS);

  try {
    const requisicao = opcoes.fetcher ?? fetch;

    const resposta = await requisicao(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });

    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error(
        'RAWG: chave inválida ou acesso não autorizado.',
      );
    }

    if (resposta.status === 429) {
      throw new Error(
        'RAWG: limite de requisições atingido. Tente mais tarde.',
      );
    }

    if (!resposta.ok) {
      throw new Error(
        `RAWG: falha na consulta (HTTP ${resposta.status}).`,
      );
    }

    let dados: Partial<RespostaRawg>;

    try {
      dados = await resposta.json();
    } catch {
      throw new Error('RAWG: resposta JSON inválida.');
    }

    if (!dados || !Array.isArray(dados.results)) {
      throw new Error('RAWG: formato de resposta inesperado.');
    }

    const jogos = dados.results
      .filter(
        (item): item is RawgJogo =>
          item != null &&
          typeof item.id === 'number' &&
          typeof item.name === 'string',
      )
      .map(converterRawgParaJogo);

    return {
      jogos,
      total:
        typeof dados.count === 'number'
          ? dados.count
          : jogos.length,
      pagina,
      temProximaPagina: Boolean(dados.next),
    };
  } catch (erro) {
    if (tempoEsgotado) {
      throw new Error('RAWG: tempo limite da consulta excedido.');
    }

    if (controller.signal.aborted) {
      throw new Error('RAWG: consulta cancelada.');
    }

    if (
      erro instanceof Error &&
      erro.message.startsWith('RAWG:')
    ) {
      throw erro;
    }

    throw new Error(
      'RAWG: falha de conexão. Verifique a internet.',
    );
  } finally {
    clearTimeout(temporizador);
    opcoes.signal?.removeEventListener('abort', cancelar);
  }
}
