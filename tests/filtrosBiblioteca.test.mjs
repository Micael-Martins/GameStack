import assert from 'node:assert/strict';
import test from 'node:test';

import {
  contarPorStatus,
  filtrarBiblioteca,
  resolverEstadoListaBiblioteca,
} from '../src/features/biblioteca/Model/filtrosBiblioteca.ts';

function criarJogo(id, nome, status) {
  return {
    id,
    jogo: { nome },
    status,
  };
}

const jogos = [
  criarJogo('1', 'Hollow Knight', 'JOGANDO'),
  criarJogo('2', 'Hades', 'CONCLUIDO'),
  criarJogo('3', 'Hollow Knight: Silksong', 'NA_FILA'),
];

test('filtro por status e busca por nome são combinados sem diferenciar maiúsculas', () => {
  assert.deepEqual(
    filtrarBiblioteca(jogos, 'JOGANDO', 'hOlLoW'),
    [jogos[0]],
  );
});

test('busca vazia não remove itens do filtro de status', () => {
  assert.deepEqual(filtrarBiblioteca(jogos, 'CONCLUIDO', '  '), [jogos[1]]);
});

test('contagem por status considera cada jogo da biblioteca', () => {
  assert.equal(contarPorStatus(jogos, 'JOGANDO'), 1);
  assert.equal(contarPorStatus(jogos, 'NA_FILA'), 1);
  assert.equal(contarPorStatus(jogos, 'ABANDONADO'), 0);
});

test('estado de erro aparece antes do estado vazio quando a lista falha ao carregar', () => {
  assert.equal(resolverEstadoListaBiblioteca({
    carregando: false,
    erro: 'Não foi possível abrir a biblioteca.',
    quantidadeTotal: 0,
    quantidadeVisivel: 0,
  }), 'ERRO');
});

test('estados de loading, biblioteca vazia e busca sem resultados são distintos', () => {
  assert.equal(resolverEstadoListaBiblioteca({ carregando: true, erro: null, quantidadeTotal: 0, quantidadeVisivel: 0 }), 'CARREGANDO');
  assert.equal(resolverEstadoListaBiblioteca({ carregando: false, erro: null, quantidadeTotal: 0, quantidadeVisivel: 0 }), 'VAZIO');
  assert.equal(resolverEstadoListaBiblioteca({ carregando: false, erro: null, quantidadeTotal: 3, quantidadeVisivel: 0 }), 'SEM_RESULTADOS');
  assert.equal(resolverEstadoListaBiblioteca({ carregando: false, erro: null, quantidadeTotal: 3, quantidadeVisivel: 2 }), null);
});
