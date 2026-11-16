import type { Jogo } from '../../models/Jogo';
import type { RawgJogo } from '../../models/RawgJogo';
import { converterRawgParaJogo, extrairSobre, type DetalhesJogoRawg, type SobreJogo } from './rawgMapper.ts';
import { consultarJsonRawg } from './rawgHttp.ts';

export { converterRawgParaJogo, extrairSobre };
export type { DetalhesJogoRawg, SobreJogo } from './rawgMapper.ts';

const RAWG_URL = 'https://api.rawg.io/api';

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
  // De onde vem a chave quando `chave` não é passada (nos testes dá para trocar).
  obterChave?: () => Promise<string>;
}

// Padrão: lê a chave do SecureStore (src/data/secure/credenciais.ts).
// O import é feito só aqui dentro para os testes no Node não carregarem o Expo.
async function obterChavePadrao(): Promise<string> {
  const { obterChaveApi } = await import('../secure/credenciais');
  return obterChaveApi();
}

export interface ResultadoBuscaRawg {
  jogos: Jogo[];
  total: number;
  pagina: number;
  temProximaPagina: boolean;
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
    opcoes.chave ?? (await (opcoes.obterChave ?? obterChavePadrao)())
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

  const dados = await consultarJsonRawg<Partial<RespostaRawg>>(url, 'consulta', opcoes);
  if (!Array.isArray(dados.results)) {
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
    total: typeof dados.count === 'number' ? dados.count : jogos.length,
    pagina,
    temProximaPagina: Boolean(dados.next),
  };
}

// Jogos mais adicionados na RAWG (Home vazia e ilustração do onboarding).
// Usa o mesmo conversor da pesquisa, então volta no model Jogo.
export async function buscarJogosPopulares(
  limite = 10,
  opcoes: Pick<OpcoesBuscaRawg, 'chave' | 'obterChave' | 'fetcher' | 'signal'> = {},
): Promise<Jogo[]> {
  const chave = (opcoes.chave ?? (await (opcoes.obterChave ?? obterChavePadrao)())).trim();
  if (!chave) {
    throw new Error('RAWG: chave da API não configurada.');
  }

  const url =
    `${RAWG_URL}/games` +
    `?key=${encodeURIComponent(chave)}` +
    `&ordering=-added` +
    `&page_size=${limite}`;

  const dados = await consultarJsonRawg<Partial<RespostaRawg>>(url, 'populares', opcoes);

  if (!dados || !Array.isArray(dados.results)) {
    throw new Error('RAWG: formato de resposta inesperado.');
  }

  return (dados.results ?? [])
    .filter((item): item is RawgJogo => item != null && typeof item.id === 'number' && typeof item.name === 'string')
    .map(converterRawgParaJogo);
}

// Só as capas dos populares (ilustração do onboarding).
export async function buscarCapasPopulares(limite = 3): Promise<string[]> {
  const jogos = await buscarJogosPopulares(limite);
  return jogos
    .map((jogo) => jogo.imagemURL)
    .filter((url): url is string => typeof url === 'string' && url.length > 0);
}

// Informações da seção "Sobre o jogo" (tela Adicionar). Só servem para mostrar:
// não vão para o banco.
// Detalhes de um jogo (/games/{id}). Usado na tela Adicionar para mostrar a
// desenvolvedora e o "Sobre o jogo", que não vêm na pesquisa.
export async function buscarDetalhes(
  apiId: string,
  opcoes: Pick<OpcoesBuscaRawg, 'chave' | 'obterChave' | 'fetcher' | 'signal'> = {},
): Promise<DetalhesJogoRawg> {
  const chave = (opcoes.chave ?? (await (opcoes.obterChave ?? obterChavePadrao)())).trim();
  if (!chave) {
    throw new Error('RAWG: chave da API não configurada.');
  }

  const url = `${RAWG_URL}/games/${encodeURIComponent(apiId)}?key=${encodeURIComponent(chave)}`;
  const dados = await consultarJsonRawg<Partial<RawgJogo>>(url, 'detalhes', opcoes);

  if (!dados || typeof dados.id !== 'number' || typeof dados.name !== 'string') {
    throw new Error('RAWG: formato de resposta inesperado.');
  }
  return { ...converterRawgParaJogo(dados as RawgJogo), sobre: extrairSobre(dados) };
}