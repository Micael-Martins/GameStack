import assert from 'node:assert/strict';
import test from 'node:test';

import {
  formatarTempoJogado,
  prepararDadosCardJogo,
} from '../src/features/biblioteca/ViewModel/cardJogoUtils.ts';

function criarItem({
  minutosJogados = 0,
  tempoMedio = 4,
  genero = 'Aventura',
  plataformas = ['PC'],
  anoLancamento = 2020,
} = {}) {
  return {
    id: 'biblioteca-1',
    jogo: {
      id: 'rawg-1',
      apiId: '1',
      origemAPI: 'RAWG',
      nome: 'Jogo de teste',
      imagemURL: null,
      genero,
      desenvolvedora: '',
      anoLancamento,
      tempoMedio,
      plataformas,
    },
    status: 'JOGANDO',
    minutosJogados,
    nota: null,
    anotacao: '',
    dataAdicao: '2026-11-15T10:00:00.000Z',
    dataConclusao: null,
    ultimaInteracao: '2026-11-15T10:00:00.000Z',
  };
}

test('Formata zero e minutos inferiores a uma hora', () => {
  assert.equal(formatarTempoJogado(0), '0 min');
  assert.equal(formatarTempoJogado(45), '45 min');
});

test('Formata horas completas e horas com minutos', () => {
  assert.equal(formatarTempoJogado(60), '1 h');
  assert.equal(formatarTempoJogado(135), '2 h 15 min');
  assert.equal(formatarTempoJogado(180), '3 h');
});

test('Trata minutos negativos e valores inválidos', () => {
  assert.equal(formatarTempoJogado(-30), '0 min');
  assert.equal(formatarTempoJogado(Number.NaN), '0 min');
  assert.equal(formatarTempoJogado(Infinity), '0 min');
});

test('Calcula progresso convertendo horas em minutos', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      minutosJogados: 120,
      tempoMedio: 4,
    }),
  );

  assert.equal(dados.temTempoMedio, true);
  assert.equal(dados.progresso, 0.5);
  assert.equal(dados.percentual, 50);
  assert.equal(dados.tempoJogado, '2 h');
});

test('Limita progresso a 100 por cento', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      minutosJogados: 600,
      tempoMedio: 4,
    }),
  );

  assert.equal(dados.progresso, 1);
  assert.equal(dados.percentual, 100);
});

test('Minutos negativos não produzem progresso negativo', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      minutosJogados: -100,
      tempoMedio: 4,
    }),
  );

  assert.equal(dados.progresso, 0);
  assert.equal(dados.percentual, 0);
  assert.equal(dados.tempoJogado, '0 min');
});

test('Sem tempo médio não calcula porcentagem', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      minutosJogados: 90,
      tempoMedio: 0,
    }),
  );

  assert.equal(dados.temTempoMedio, false);
  assert.equal(dados.progresso, 0);
  assert.equal(dados.percentual, null);
  assert.equal(dados.tempoJogado, '1 h 30 min');
});

test('Tempo médio inválido não produz NaN na barra', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      minutosJogados: 90,
      tempoMedio: Number.NaN,
    }),
  );

  assert.equal(dados.temTempoMedio, false);
  assert.equal(dados.progresso, 0);
  assert.equal(dados.percentual, null);
});

test('Exibe o gênero como informação secundária', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      genero: 'RPG, Aventura',
      plataformas: ['PC'],
    }),
  );

  assert.equal(dados.resumo, 'RPG, Aventura');
});

test('Usa plataforma ou ano quando não existe gênero', () => {
  const comPlataforma = prepararDadosCardJogo(
    criarItem({
      genero: '',
      plataformas: ['PlayStation 5'],
    }),
  );

  const comAno = prepararDadosCardJogo(
    criarItem({
      genero: '',
      plataformas: [],
      anoLancamento: 2020,
    }),
  );

  assert.equal(comPlataforma.resumo, 'PlayStation 5');
  assert.equal(comAno.resumo, '2020');
});

test('Sem gênero, plataforma e ano mantém resumo vazio', () => {
  const dados = prepararDadosCardJogo(
    criarItem({
      genero: '',
      plataformas: [],
      anoLancamento: null,
    }),
  );

  assert.equal(dados.resumo, '');
});
