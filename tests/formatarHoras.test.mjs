import assert from 'node:assert/strict';
import test from 'node:test';

import { formatarHoras, formatarQuando, horasInteiras } from '../src/utils/formatarHoras.ts';

test('formatarHoras: horas e minutos', () => {
  assert.equal(formatarHoras(2550), '42h 30min'); // exemplo do cartão
  assert.equal(formatarHoras(540), '9h');
  assert.equal(formatarHoras(45), '45min');
  assert.equal(formatarHoras(0), '0h');
});

test('formatarHoras: valores inválidos viram 0h', () => {
  assert.equal(formatarHoras(-30), '0h');
  assert.equal(formatarHoras(Number.NaN), '0h');
});

test('horasInteiras arredonda para baixo', () => {
  assert.equal(horasInteiras(2550), 42);
  assert.equal(horasInteiras(59), 0);
});

test('formatarQuando: hoje, ontem, dias e data', () => {
  const agora = new Date(2026, 10, 15, 10, 0); // 15 nov 2026, 10h
  assert.equal(formatarQuando(new Date(2026, 10, 15, 8, 0).toISOString(), agora), 'hoje');
  assert.equal(formatarQuando(new Date(2026, 10, 14, 23, 0).toISOString(), agora), 'ontem');
  assert.equal(formatarQuando(new Date(2026, 10, 12).toISOString(), agora), 'há 3 dias');
  assert.equal(formatarQuando(new Date(2026, 10, 2).toISOString(), agora), '02 nov');
  assert.equal(formatarQuando('data inválida', agora), '');
});