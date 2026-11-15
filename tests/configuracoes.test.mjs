import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import { APAGAR_DADOS, CRIAR_TABELAS } from '../src/data/db/esquema.ts';
import { calcularDataLembrete, mensagemLembrete } from '../src/data/services/regrasLembrete.ts';
import { horarioValido, mascararHorario } from '../src/features/configuracoes/Model/horario.ts';

test('mascararHorario coloca os dois pontos enquanto digita', () => {
  assert.equal(mascararHorario('1'), '1');
  assert.equal(mascararHorario('19'), '19');
  assert.equal(mascararHorario('193'), '19:3');
  assert.equal(mascararHorario('1930'), '19:30');
  assert.equal(mascararHorario('19:305'), '19:30');
  assert.equal(mascararHorario('ab19cd'), '19');
});

test('horarioValido aceita de 00:00 a 23:59', () => {
  for (const ok of ['00:00', '07:05', '19:00', '23:59']) assert.equal(horarioValido(ok), true, ok);
  for (const ruim of ['24:00', '19:60', '9:00', '1900', '', '19:0']) assert.equal(horarioValido(ruim), false, ruim);
});

test('lembrete conta 5 dias a partir da última interação, no horário escolhido', () => {
  const ultimaInteracao = new Date(2026, 10, 10, 15, 0); // 10/11, 15:00
  const agora = new Date(2026, 10, 12, 9, 0); // 12/11: abrir o app não muda nada
  const data = calcularDataLembrete('19:30', ultimaInteracao, agora);

  assert.equal(data.getDate(), 15);
  assert.equal(data.getMonth(), 10);
  assert.equal(data.getHours(), 19);
  assert.equal(data.getMinutes(), 30);
});

test('jogo parado há mais de 5 dias: lembrete no próximo horário (hoje ou amanhã)', () => {
  const ultimaInteracao = new Date(2026, 10, 1, 15, 0);

  const antesDoHorario = calcularDataLembrete('19:00', ultimaInteracao, new Date(2026, 10, 14, 10, 0));
  assert.equal(antesDoHorario.getDate(), 14);
  assert.equal(antesDoHorario.getHours(), 19);

  const depoisDoHorario = calcularDataLembrete('19:00', ultimaInteracao, new Date(2026, 10, 14, 21, 0));
  assert.equal(depoisDoHorario.getDate(), 15);
  assert.equal(depoisDoHorario.getHours(), 19);
});

test('mensagem do lembrete em português do Brasil, com o nome do jogo', () => {
  assert.equal(mensagemLembrete('Zelda'), 'Há quanto tempo você não salva o mundo em Zelda? Vai jogar um pouco!');
});

test('APAGAR_DADOS apaga os jogos e volta o usuário ao padrão, sem apagar usuário e biblioteca', () => {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(CRIAR_TABELAS);
  db.prepare('INSERT INTO usuario VALUES (?, ?, ?, ?)').run('u1', 'Lopes', 1, '21:00');
  db.prepare('INSERT INTO biblioteca VALUES (?, ?)').run('b1', 'u1');
  db.prepare(`INSERT INTO jogo (id, apiId, origemAPI, nome) VALUES ('j1', '1', 'RAWG', 'Zelda')`).run();
  db.prepare(
    `INSERT INTO jogo_biblioteca (id, bibliotecaId, jogoId, status, dataAdicao, ultimaInteracao)
     VALUES ('jb1', 'b1', 'j1', 'JOGANDO', '2026-11-14', '2026-11-14')`,
  ).run();

  db.exec(APAGAR_DADOS);

  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM jogo_biblioteca').get().n, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM jogo').get().n, 0);
  assert.equal(db.prepare('SELECT COUNT(*) AS n FROM biblioteca').get().n, 1);
  assert.deepEqual({ ...db.prepare('SELECT * FROM usuario').get() }, {
    id: 'u1',
    nome: 'Jogador',
    notificacaoAtiva: 0,
    horarioNotificacao: null,
  });
});
