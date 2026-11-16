type OpcoesConsultaRawg = {
  fetcher?: typeof fetch;
  signal?: AbortSignal;
  tempoLimiteMs?: number;
};

const TEMPO_LIMITE_PADRAO_MS = 10000;

// Compartilha timeout, cancelamento e normalização de erros entre endpoints.
export async function consultarJsonRawg<T>(
  url: string,
  contexto: string,
  opcoes: OpcoesConsultaRawg = {},
): Promise<T> {
  const controller = new AbortController();
  let tempoEsgotado = false;
  const cancelar = () => controller.abort();

  if (opcoes.signal?.aborted) controller.abort();
  else opcoes.signal?.addEventListener('abort', cancelar);

  const temporizador = setTimeout(() => {
    tempoEsgotado = true;
    controller.abort();
  }, opcoes.tempoLimiteMs ?? TEMPO_LIMITE_PADRAO_MS);

  try {
    if (controller.signal.aborted) throw new Error('RAWG: consulta cancelada.');
    const resposta = await (opcoes.fetcher ?? fetch)(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (resposta.status === 401 || resposta.status === 403) {
      throw new Error('RAWG: chave inválida ou acesso não autorizado.');
    }
    if (resposta.status === 429) {
      throw new Error('RAWG: limite de requisições atingido. Tente mais tarde.');
    }
    if (!resposta.ok) {
      throw new Error(`RAWG: falha ao buscar ${contexto} (HTTP ${resposta.status}).`);
    }
    try {
      return await resposta.json() as T;
    } catch {
      throw new Error('RAWG: resposta JSON inválida.');
    }
  } catch (erro) {
    if (tempoEsgotado) throw new Error('RAWG: tempo limite da consulta excedido.');
    if (controller.signal.aborted) throw new Error('RAWG: consulta cancelada.');
    if (erro instanceof Error && erro.message.startsWith('RAWG:')) throw erro;
    throw new Error('RAWG: falha de conexão. Verifique a internet.');
  } finally {
    clearTimeout(temporizador);
    opcoes.signal?.removeEventListener('abort', cancelar);
  }
}
