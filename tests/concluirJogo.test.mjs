import assert from 'node:assert/strict';
import test from 'node:test';

import {
  linhaConclusao,
  numeroDoZerado,
  proximoDaFila,
  ROTULOS_NOTA,
  textoNota,
} from '../src/features/biblioteca/Model/conclusao.ts';

function item(id, status, dataAdicao, nome = id) {
  return {
    id,
    status,
    dataAdicao,
    ultimaInteracao: dataAdicao,
    minutosJogados: 0,
    nota: null,
    anotacao: '',
    dataConclusao: null,
    jogo: { nome },
  };
}

test('cada nota tem a sua descrição; sem nota pede para tocar nas estrelas', () => {
  assert.deepEqual([1, 2, 3, 4, 5].map(textoNota), [...ROTULOS_NOTA]);
  assert.deepEqual(ROTULOS_NOTA, ['Não curti', 'Mais ou menos', 'Bom', 'Muito bom', 'Obra-prima']);
  assert.equal(textoNota(null), 'Toque nas estrelas para avaliar');
});

test('próximo da fila é o jogo Na fila adicionado há mais tempo', () => {
  const jogos = [
    item('a', 'NA_FILA', '2026-11-10T10:00:00.000Z'),
    item('b', 'JOGANDO', '2026-01-01T10:00:00.000Z'),
    item('c', 'NA_FILA', '2026-11-02T10:00:00.000Z'),
    item('d', 'NA_FILA', '2026-11-05T10:00:00.000Z'),
  ];
  assert.equal(proximoDaFila(jogos)?.id, 'c');
});

test('próximo da fila: nulo quando a fila está vazia, e nunca o próprio jogo', () => {
  assert.equal(proximoDaFila([item('a', 'JOGANDO', '2026-11-01')]), null);
  assert.equal(proximoDaFila([item('a', 'NA_FILA', '2026-11-01')], 'a'), null);
});

test('número do zerado: concluídos (sem contar o atual) + 1', () => {
  const jogos = [
    item('a', 'CONCLUIDO', '2026-01-01'),
    item('b', 'CONCLUIDO', '2026-01-02'),
    item('c', 'ABANDONADO', '2026-01-03'),
    item('atual', 'JOGANDO', '2026-01-04'),
  ];
  assert.equal(numeroDoZerado(jogos, 'atual'), 3);
  assert.equal(numeroDoZerado([], 'atual'), 1);
});

test('linha "48h jogadas · 3º jogo zerado"', () => {
  assert.equal(linhaConclusao(48 * 60 + 30, 3), '48h jogadas · 3º jogo zerado');
});
