import type { Jogo } from '../../../models/Jogo';
import type {
  OpcoesBuscaRawg,
  ResultadoBuscaRawg,
} from '../../../data/services/rawgService';

export interface EstadoPesquisa {
  termoPesquisado: string;
  jogos: Jogo[];
  total: number;
  pagina: number;
  temProximaPagina: boolean;
  carregando: boolean;
  carregandoMais: boolean;
  pesquisou: boolean;
  erro: string | null;
}

export const ESTADO_INICIAL_PESQUISA: EstadoPesquisa = {
  termoPesquisado: '',
  jogos: [],
  total: 0,
  pagina: 1,
  temProximaPagina: false,
  carregando: false,
  carregandoMais: false,
  pesquisou: false,
  erro: null,
};

type BuscarJogos = (
  termo: string,
  opcoes: OpcoesBuscaRawg,
) => Promise<ResultadoBuscaRawg>;

function mensagemDeErro(erro: unknown): string {
  if (erro instanceof Error && erro.message) {
    return erro.message;
  }

  return 'Não foi possível buscar os jogos. Tente novamente.';
}

export function criarPesquisaController(
  buscarJogos: BuscarJogos,
  aoMudar: (estado: EstadoPesquisa) => void = () => {},
) {
  let estado: EstadoPesquisa = { ...ESTADO_INICIAL_PESQUISA };
  let requisicao: AbortController | null = null;
  let versao = 0;

  function publicar(alteracoes: Partial<EstadoPesquisa>) {
    estado = { ...estado, ...alteracoes };
    aoMudar(estado);
  }

  // Invalida qualquer resposta antiga, mesmo que a API ignore o cancelamento.
  function interromper() {
    versao += 1;
    requisicao?.abort();
    requisicao = null;
  }

  function cancelar() {
    interromper();
    publicar({
      carregando: false,
      carregandoMais: false,
    });
  }

  function limpar() {
    interromper();
    publicar({ ...ESTADO_INICIAL_PESQUISA });
  }

  async function pesquisar(entrada: string): Promise<boolean> {
    const termo = entrada.trim();

    interromper();

    if (!termo) {
      publicar({ ...ESTADO_INICIAL_PESQUISA });
      return false;
    }

    const versaoAtual = versao;
    const controlador = new AbortController();
    requisicao = controlador;

    publicar({
      termoPesquisado: termo,
      jogos: [],
      total: 0,
      pagina: 1,
      temProximaPagina: false,
      carregando: true,
      carregandoMais: false,
      pesquisou: false,
      erro: null,
    });

    try {
      const resultado = await buscarJogos(termo, {
        pagina: 1,
        signal: controlador.signal,
      });

      if (versaoAtual !== versao || controlador.signal.aborted) {
        return false;
      }

      publicar({
        jogos: resultado.jogos,
        total: resultado.total,
        pagina: resultado.pagina,
        temProximaPagina: resultado.temProximaPagina,
        carregando: false,
        pesquisou: true,
      });

      return true;
    } catch (erro) {
      if (versaoAtual !== versao || controlador.signal.aborted) {
        return false;
      }

      publicar({
        carregando: false,
        pesquisou: true,
        erro: mensagemDeErro(erro),
      });

      return false;
    } finally {
      if (versaoAtual === versao) {
        requisicao = null;
      }
    }
  }

  async function carregarMais(): Promise<boolean> {
    if (
      !estado.pesquisou ||
      !estado.termoPesquisado ||
      !estado.temProximaPagina ||
      estado.carregando ||
      estado.carregandoMais
    ) {
      return false;
    }

    const versaoAtual = versao;
    const proximaPagina = estado.pagina + 1;
    const controlador = new AbortController();

    requisicao = controlador;

    publicar({
      carregandoMais: true,
      erro: null,
    });

    try {
      const resultado = await buscarJogos(estado.termoPesquisado, {
        pagina: proximaPagina,
        signal: controlador.signal,
      });

      if (versaoAtual !== versao || controlador.signal.aborted) {
        return false;
      }

      // Evita repetir jogos que já vieram de páginas anteriores.
      const idsConhecidos = new Set(estado.jogos.map((jogo) => jogo.id));

      const jogosNovos = resultado.jogos.filter((jogo) => {
        if (idsConhecidos.has(jogo.id)) {
          return false;
        }

        idsConhecidos.add(jogo.id);
        return true;
      });

      publicar({
        jogos: [...estado.jogos, ...jogosNovos],
        total: resultado.total,
        pagina: resultado.pagina,
        temProximaPagina: resultado.temProximaPagina,
        carregandoMais: false,
      });

      return true;
    } catch (erro) {
      if (versaoAtual !== versao || controlador.signal.aborted) {
        return false;
      }

      publicar({
        carregandoMais: false,
        erro: mensagemDeErro(erro),
      });

      return false;
    } finally {
      if (versaoAtual === versao) {
        requisicao = null;
      }
    }
  }

  return {
    obterEstado: () => estado,
    pesquisar,
    carregarMais,
    cancelar,
    limpar,
    interromper,
  };
}
