import test from 'node:test';
import assert from 'node:assert/strict';

import { calcularTotalMinutos, converterHorasParaMinutos } from '../src/features/biblioteca/Model/registroHoras.ts';

test('converte horas inteiras e decimais em minutos', () => {
  assert.equal(converterHorasParaMinutos('1'), 60);
  assert.equal(converterHorasParaMinutos('1,5'), 90);
  assert.equal(converterHorasParaMinutos('0,25'), 15);
});

test('rejeita entrada vazia, zero e valores inválidos', () => {
  for (const texto of ['', '0', '0,001', '-1', 'abc', '1,2,3', '100000']) {
    assert.equal(converterHorasParaMinutos(texto), null, texto);
  }
});

test('soma a sessão ao total já registrado sem substituir o histórico', () => {
  assert.equal(calcularTotalMinutos(125, 90), 215);
  assert.equal(calcularTotalMinutos(-10, 30), 30);
});
