import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buscarDetalhes,
  buscarJogosPopulares,
} from '../src/data/services/rawgService.ts';

function requisicaoSemResposta(_url, { signal }) {
  return new Promise((_, reject) => {
    signal.addEventListener('abort', () => {
      reject(new Error('Consulta cancelada'));
    }, { once: true });
  });
}

test('Populares encerra a consulta quando o tempo limite acaba', async () => {
  await assert.rejects(
    buscarJogosPopulares(10, {
      chave: 'teste',
      fetcher: requisicaoSemResposta,
      tempoLimiteMs: 10,
    }),
    /tempo limite/,
  );
});

test('Detalhes encerra a consulta quando o tempo limite acaba', async () => {
  await assert.rejects(
    buscarDetalhes('1', {
      chave: 'teste',
      fetcher: requisicaoSemResposta,
      tempoLimiteMs: 10,
    }),
    /tempo limite/,
  );
});

test('Populares informa falha de conexão', async () => {
  await assert.rejects(
    buscarJogosPopulares(10, {
      chave: 'teste',
      fetcher: async () => {
        throw new Error('Network error');
      },
    }),
    /falha de conexão/,
  );
});

test('Detalhes aceita o cancelamento da consulta', async () => {
  const controller = new AbortController();
  controller.abort();

  await assert.rejects(
    buscarDetalhes('1', {
      chave: 'teste',
      signal: controller.signal,
    }),
    /consulta cancelada/,
  );
});
