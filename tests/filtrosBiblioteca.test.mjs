import assert from 'node:assert/strict';
import test from 'node:test';

import {
  contagemPorFiltro,
  FILTROS,
  filtrarJogos,
  filtroValido,
  textoResumo,
} from '../src/features/biblioteca/Model/filtrosBiblioteca.ts';

const jogo = (id, status, minutosJogados = 0) => ({ id, status, minutosJogados });

const biblioteca = [
  jogo('1', 'JOGANDO', 600),
  jogo('2', 'JOGANDO', 90),
  jogo('3', 'NA_FILA'),
  jogo('4', 'CONCLUIDO', 300),
  jogo('5', 'ABANDONADO', 45),
];

test('Chips na ordem do protótipo', () => {
  assert.deepEqual(
    FILTROS.map((item) => item.rotulo),
    ['Todos', 'Jogando', 'Na fila', 'Concluídos', 'Abandonados'],
  );
});

test('Filtrar: "Todos" mostra tudo e cada status só os seus', () => {
  assert.equal(filtrarJogos(biblioteca, 'TODOS').length, 5);
  assert.deepEqual(filtrarJogos(biblioteca, 'JOGANDO').map((j) => j.id), ['1', '2']);
  assert.deepEqual(filtrarJogos(biblioteca, 'ABANDONADO').map((j) => j.id), ['5']);
});

test('Contagem de cada chip bate com os jogos', () => {
  assert.deepEqual(contagemPorFiltro(biblioteca), { TODOS: 5, JOGANDO: 2, NA_FILA: 1, CONCLUIDO: 1, ABANDONADO: 1 });
  assert.deepEqual(contagemPorFiltro([]), { TODOS: 0, JOGANDO: 0, NA_FILA: 0, CONCLUIDO: 0, ABANDONADO: 0 });
});

test('Filtro salvo inválido ou vazio volta para "Todos"', () => {
  assert.equal(filtroValido('CONCLUIDO'), 'CONCLUIDO');
  assert.equal(filtroValido(''), 'TODOS');
  assert.equal(filtroValido('qualquer coisa'), 'TODOS');
  assert.equal(filtroValido(null), 'TODOS');
});

test('Resumo: "5 jogos · 17h registradas" e singular com 1 jogo', () => {
  assert.equal(textoResumo(biblioteca), '5 jogos · 17h registradas'); // 1035 min = 17h
  assert.equal(textoResumo([jogo('1', 'NA_FILA')]), '1 jogo · 0h registradas');
});
