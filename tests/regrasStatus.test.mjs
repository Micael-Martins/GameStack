import assert from 'node:assert/strict';
import test from 'node:test';

import { aplicarMudancaStatus, notaValida } from '../src/store/regrasStatus.ts';

const AGORA = new Date('2026-11-14T20:00:00.000Z');
const ISO = AGORA.toISOString();

function jogo(status, nota = null, dataConclusao = null) {
  return { status, nota, dataConclusao };
}

// As 5 transições pedidas no cartão.

test('Na fila → Jogando: sem nota e sem data de conclusão', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('NA_FILA'), 'JOGANDO', undefined, AGORA), {
    status: 'JOGANDO',
    nota: null,
    dataConclusao: null,
  });
});

test('Jogando → Concluído: preenche dataConclusao com agora e grava a nota', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('JOGANDO'), 'CONCLUIDO', 5, AGORA), {
    status: 'CONCLUIDO',
    nota: 5,
    dataConclusao: ISO,
  });
});

test('Concluído → Jogando: limpa dataConclusao e nota', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('CONCLUIDO', 4, ISO), 'JOGANDO', undefined, AGORA), {
    status: 'JOGANDO',
    nota: null,
    dataConclusao: null,
  });
});

test('Jogando → Abandonado: sem nota e sem data de conclusão', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('JOGANDO'), 'ABANDONADO', undefined, AGORA), {
    status: 'ABANDONADO',
    nota: null,
    dataConclusao: null,
  });
});

test('Abandonado → Na fila: perde a nota', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('ABANDONADO', 3), 'NA_FILA', undefined, AGORA), {
    status: 'NA_FILA',
    nota: null,
    dataConclusao: null,
  });
});

// Casos extras das regras.

test('Concluído → Abandonado: mantém a nota e limpa a data (abandonado não conta como concluído)', () => {
  assert.deepEqual(aplicarMudancaStatus(jogo('CONCLUIDO', 4, ISO), 'ABANDONADO', undefined, AGORA), {
    status: 'ABANDONADO',
    nota: 4,
    dataConclusao: null,
  });
});

test('Nota inválida é ignorada (fora de 1 a 5 ou não inteira)', () => {
  assert.equal(aplicarMudancaStatus(jogo('JOGANDO'), 'CONCLUIDO', 9, AGORA).nota, null);
  assert.equal(aplicarMudancaStatus(jogo('JOGANDO'), 'CONCLUIDO', 2.5, AGORA).nota, null);
  assert.equal(notaValida(0), false);
  assert.equal(notaValida(5), true);
});

test('Jogando e Na fila nunca têm nota, mesmo se uma for passada', () => {
  assert.equal(aplicarMudancaStatus(jogo('CONCLUIDO', 5, ISO), 'JOGANDO', 5, AGORA).nota, null);
  assert.equal(aplicarMudancaStatus(jogo('ABANDONADO', 2), 'NA_FILA', 2, AGORA).nota, null);
});
