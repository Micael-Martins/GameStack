import assert from 'node:assert/strict';
import test from 'node:test';

import {
  desfazer,
  iniciarProgresso,
  percentualDoTempoMedio,
  SOMAS_RAPIDAS,
  somar,
  substituirTotal,
  textoSessao,
  totalDigitadoEmMinutos,
} from '../src/features/biblioteca/Model/registroHoras.ts';

test('botões +30min, +1h e +2h somam certo', () => {
  assert.deepEqual(SOMAS_RAPIDAS.map((s) => s.minutos), [30, 60, 120]);
  let p = iniciarProgresso(2550); // 42h 30min
  p = somar(p, 30);
  p = somar(p, 60);
  p = somar(p, 120);
  assert.equal(p.minutos, 2550 + 210);
});

test('Desfazer volta uma mudança por vez e para no valor inicial', () => {
  let p = iniciarProgresso(100);
  p = somar(p, 60);
  p = somar(p, 120);
  p = desfazer(p);
  assert.equal(p.minutos, 160);
  p = desfazer(p);
  assert.equal(p.minutos, 100);
  p = desfazer(p); // nada para desfazer
  assert.equal(p.minutos, 100);
  assert.equal(p.historico.length, 0);
});

test('total do console substitui o total (e também pode ser desfeito)', () => {
  let p = somar(iniciarProgresso(600), 60);
  p = substituirTotal(p, 44 * 60);
  assert.equal(p.minutos, 2640);
  p = desfazer(p);
  assert.equal(p.minutos, 660);
});

test('campo do total aceita 44, 44,5 e 0; recusa negativo, vazio e texto', () => {
  assert.equal(totalDigitadoEmMinutos('44'), 2640);
  assert.equal(totalDigitadoEmMinutos('44,5'), 2670);
  assert.equal(totalDigitadoEmMinutos('44.25'), 2655);
  assert.equal(totalDigitadoEmMinutos('0'), 0);
  for (const ruim of ['', '  ', '-1', 'abc', '1,2,3', '12h']) assert.equal(totalDigitadoEmMinutos(ruim), null, ruim);
});

test('linha da sessão: "+X nesta sessão" quando aumentou; senão "Antes: X"', () => {
  assert.equal(textoSessao(2550, 2550), 'Antes: 42h 30min');
  assert.equal(textoSessao(2550, 2640), '+1h 30min nesta sessão');
  assert.equal(textoSessao(2550, 600), 'Antes: 42h 30min');
});

test('percentual do tempo médio (some quando a RAWG não tem o tempo médio)', () => {
  assert.equal(percentualDoTempoMedio(2550, 50), 85);
  assert.equal(percentualDoTempoMedio(3600, 50), 120);
  assert.equal(percentualDoTempoMedio(100, 0), null);
});
