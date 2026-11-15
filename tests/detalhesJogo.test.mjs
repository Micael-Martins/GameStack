import assert from 'node:assert/strict';
import test from 'node:test';

import { anotacaoMudou, fraseStatus, linhasInformacoes } from '../src/features/biblioteca/Model/detalhesJogo.ts';
import { formatarData } from '../src/utils/formatarHoras.ts';

// Datas ao meio-dia para não depender do fuso do computador.
const agora = new Date(2026, 10, 15, 12);

function item(campos = {}) {
  return {
    id: 'b1',
    jogo: { nome: 'Zelda', tempoMedio: 50 },
    status: 'JOGANDO',
    minutosJogados: 0,
    nota: null,
    anotacao: '',
    dataAdicao: new Date(2026, 7, 12, 12).toISOString(),
    dataConclusao: null,
    ultimaInteracao: new Date(2026, 10, 14, 12).toISOString(),
    ...campos,
  };
}

test('formatarData: "12 ago 2026" e vazio quando não tem data', () => {
  assert.equal(formatarData(new Date(2026, 7, 12, 12).toISOString()), '12 ago 2026');
  assert.equal(formatarData(null), '');
  assert.equal(formatarData('não é data'), '');
});

test('Frase do status segue o protótipo', () => {
  assert.equal(fraseStatus(item({ status: 'NA_FILA' }), agora), 'Esperando a sua vez');
  assert.equal(fraseStatus(item({ status: 'JOGANDO' }), agora), 'Desde 12 ago 2026');
  assert.equal(fraseStatus(item({ status: 'ABANDONADO' }), agora), 'Fica fora da fila');
});

test('Concluído: "Zerado hoje", "Zerado há 3 dias" ou a data', () => {
  const concluido = (data) => item({ status: 'CONCLUIDO', dataConclusao: data.toISOString() });
  assert.equal(fraseStatus(concluido(new Date(2026, 10, 15, 9)), agora), 'Zerado hoje');
  assert.equal(fraseStatus(concluido(new Date(2026, 10, 12, 9)), agora), 'Zerado há 3 dias');
  assert.equal(fraseStatus(concluido(new Date(2026, 9, 2, 9)), agora), 'Zerado em 02 out 2026');
});

test('Informações: adicionado, última sessão e "—" quando não concluiu', () => {
  assert.deepEqual(linhasInformacoes(item(), agora), [
    { rotulo: 'Adicionado em', valor: '12 ago 2026' },
    { rotulo: 'Última sessão', valor: 'ontem' },
    { rotulo: 'Concluído em', valor: '—' },
  ]);
});

test('Salvar só grava quando a anotação mudou', () => {
  assert.equal(anotacaoMudou('Gostei', 'Gostei'), false);
  assert.equal(anotacaoMudou('Gostei', '  Gostei  '), false);
  assert.equal(anotacaoMudou('Gostei', 'Gostei muito'), true);
  assert.equal(anotacaoMudou('', 'Primeira anotação'), true);
});