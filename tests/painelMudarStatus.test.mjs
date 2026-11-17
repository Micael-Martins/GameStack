import assert from 'node:assert/strict';
import test from 'node:test';

import {
  acaoDaOpcao,
  nomeDoStatus,
  OPCOES_PAINEL_STATUS,
} from '../src/features/biblioteca/Model/opcoesPainelStatus.ts';

import { aplicarMudancaStatus } from '../src/store/regrasStatus.ts';

test('Painel apresenta exatamente os quatro status, na ordem do protótipo', () => {
  assert.deepEqual(
    OPCOES_PAINEL_STATUS.map((opcao) => opcao.status),
    ['NA_FILA', 'JOGANDO', 'CONCLUIDO', 'ABANDONADO'],
  );
});

test('Títulos seguem o cartão', () => {
  assert.deepEqual(
    OPCOES_PAINEL_STATUS.map((opcao) => opcao.titulo),
    ['Voltar para a fila', 'Jogando', 'Concluir jogo', 'Abandonar'],
  );
});

test('Todas as opções possuem descrição', () => {
  for (const opcao of OPCOES_PAINEL_STATUS) {
    assert.ok(opcao.descricao.trim());
  }
});

test('Só "Concluir jogo" tem destaque branco', () => {
  const comDestaque = OPCOES_PAINEL_STATUS.filter((opcao) => opcao.destaque).map((opcao) => opcao.status);
  assert.deepEqual(comDestaque, ['CONCLUIDO']);
});

test('Tocar no status atual não faz nada', () => {
  assert.equal(acaoDaOpcao('JOGANDO', 'JOGANDO'), 'nada');
  assert.equal(acaoDaOpcao('CONCLUIDO', 'CONCLUIDO'), 'nada');
});

test('"Concluir jogo" sempre vai para a tela de conclusão', () => {
  assert.equal(acaoDaOpcao('JOGANDO', 'CONCLUIDO'), 'concluir');
  assert.equal(acaoDaOpcao('NA_FILA', 'CONCLUIDO'), 'concluir');
  assert.equal(acaoDaOpcao('ABANDONADO', 'CONCLUIDO'), 'concluir');
});

test('As outras opções mudam o status na hora', () => {
  assert.equal(acaoDaOpcao('NA_FILA', 'JOGANDO'), 'mudar');
  assert.equal(acaoDaOpcao('JOGANDO', 'NA_FILA'), 'mudar');
  assert.equal(acaoDaOpcao('JOGANDO', 'ABANDONADO'), 'mudar');
  assert.equal(acaoDaOpcao('CONCLUIDO', 'JOGANDO'), 'mudar');
});

test('Linha "Agora:" mostra o nome do status', () => {
  assert.equal(nomeDoStatus('NA_FILA'), 'Na fila');
  assert.equal(nomeDoStatus('CONCLUIDO'), 'Concluído');
});

test('Concluir usa as regras existentes de nota e data', () => {
  const agora = new Date('2026-11-15T12:00:00.000Z');
  const atual = { status: 'JOGANDO', nota: null, dataConclusao: null };

  assert.deepEqual(aplicarMudancaStatus(atual, 'CONCLUIDO', 5, agora), {
    status: 'CONCLUIDO',
    nota: 5,
    dataConclusao: agora.toISOString(),
  });
});

test('Voltar a jogar limpa nota e data de conclusão', () => {
  const atual = { status: 'CONCLUIDO', nota: 4, dataConclusao: '2026-11-14T12:00:00.000Z' };

  assert.deepEqual(aplicarMudancaStatus(atual, 'JOGANDO'), {
    status: 'JOGANDO',
    nota: null,
    dataConclusao: null,
  });
});