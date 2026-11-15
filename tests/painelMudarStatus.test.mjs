import assert from 'node:assert/strict';
import test from 'node:test';

import {
  aceitaAvaliacao,
  notaParaMudanca,
  OPCOES_PAINEL_STATUS,
  podeSalvarStatus,
} from '../src/features/biblioteca/Model/opcoesPainelStatus.ts';

import {
  aplicarMudancaStatus,
} from '../src/store/regrasStatus.ts';

test('Painel apresenta exatamente os quatro status', () => {
  assert.deepEqual(
    OPCOES_PAINEL_STATUS.map((opcao) => opcao.status),
    ['NA_FILA', 'JOGANDO', 'CONCLUIDO', 'ABANDONADO'],
  );
});

test('Todas as opções possuem título e descrição', () => {
  for (const opcao of OPCOES_PAINEL_STATUS) {
    assert.ok(opcao.titulo.trim());
    assert.ok(opcao.descricao.trim());
  }
});

test('Impede salvar quando o status não mudou', () => {
  assert.equal(podeSalvarStatus('JOGANDO', 'JOGANDO'), false);
  assert.equal(podeSalvarStatus('NA_FILA', 'NA_FILA'), false);
});

test('Permite salvar quando outro status é selecionado', () => {
  assert.equal(podeSalvarStatus('NA_FILA', 'JOGANDO'), true);
  assert.equal(podeSalvarStatus('JOGANDO', 'CONCLUIDO'), true);
  assert.equal(podeSalvarStatus('CONCLUIDO', 'ABANDONADO'), true);
});

test('Avaliação aparece apenas em Concluído e Abandonado', () => {
  assert.equal(aceitaAvaliacao('CONCLUIDO'), true);
  assert.equal(aceitaAvaliacao('ABANDONADO'), true);
  assert.equal(aceitaAvaliacao('JOGANDO'), false);
  assert.equal(aceitaAvaliacao('NA_FILA'), false);
});

test('Encaminha avaliação ao concluir ou abandonar', () => {
  assert.equal(notaParaMudanca('CONCLUIDO', 5), 5);
  assert.equal(notaParaMudanca('ABANDONADO', 3), 3);
});

test('Não encaminha avaliação para Jogando ou Na fila', () => {
  assert.equal(notaParaMudanca('JOGANDO', 5), undefined);
  assert.equal(notaParaMudanca('NA_FILA', 5), undefined);
  assert.equal(notaParaMudanca('CONCLUIDO', null), undefined);
});

test('Concluir usa as regras existentes de nota e data', () => {
  const agora = new Date('2026-11-15T12:00:00.000Z');
  const atual = {
    status: 'JOGANDO',
    nota: null,
    dataConclusao: null,
  };

  assert.deepEqual(
    aplicarMudancaStatus(
      atual,
      'CONCLUIDO',
      notaParaMudanca('CONCLUIDO', 5),
      agora,
    ),
    {
      status: 'CONCLUIDO',
      nota: 5,
      dataConclusao: agora.toISOString(),
    },
  );
});

test('Voltar a jogar limpa nota e data de conclusão', () => {
  const atual = {
    status: 'CONCLUIDO',
    nota: 4,
    dataConclusao: '2026-11-14T12:00:00.000Z',
  };

  const resultado = aplicarMudancaStatus(
    atual,
    'JOGANDO',
    notaParaMudanca('JOGANDO', 4),
  );

  assert.deepEqual(resultado, {
    status: 'JOGANDO',
    nota: null,
    dataConclusao: null,
  });
});
