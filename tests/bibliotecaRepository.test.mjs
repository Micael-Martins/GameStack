import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import {
  criarBibliotecaRepository,
  JogoJaNaBibliotecaError,
} from '../src/data/db/bibliotecaRepositoryBase.ts';
import { CRIAR_TABELAS } from '../src/data/db/esquema.ts';

// Banco SQLite em memória do Node com o mesmo esquema do app,
// imitando os métodos do expo-sqlite que o repositório usa.
function criarBanco() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(CRIAR_TABELAS);
  db.prepare('INSERT INTO usuario (id, nome, notificacaoAtiva) VALUES (?, ?, ?)').run('u1', 'Jogador', 0);
  db.prepare('INSERT INTO biblioteca (id, usuarioId) VALUES (?, ?)').run('b1', 'u1');
  return {
    db,
    runAsync: async (sql, params = []) => db.prepare(sql).run(...params),
    getFirstAsync: async (sql, params = []) => db.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql, params = []) => db.prepare(sql).all(...params),
  };
}

function criarRepositorio() {
  const banco = criarBanco();
  let contador = 0;
  let relogio = Date.parse('2026-11-14T12:00:00.000Z');
  const repo = criarBibliotecaRepository({
    obterBanco: async () => banco,
    gerarId: () => `id-${++contador}`,
    agora: () => new Date((relogio += 60_000)), // cada operação acontece 1 minuto depois
  });
  return { repo, banco };
}

function jogo(apiId, extras = {}) {
  return {
    id: '',
    apiId,
    origemAPI: 'RAWG',
    nome: `Jogo ${apiId}`,
    imagemURL: null,
    genero: 'Aventura',
    desenvolvedora: '',
    anoLancamento: 2017,
    tempoMedio: 50,
    plataformas: ['Switch', 'Wii U'],
    ...extras,
  };
}

function contar(banco, tabela) {
  return banco.db.prepare(`SELECT COUNT(*) AS total FROM ${tabela}`).get().total;
}

// ---------- Cartão: adicionar jogo na biblioteca ----------

test('salvarJogo não cria duplicata na tabela jogo (INSERT OR IGNORE)', async () => {
  const { repo, banco } = criarRepositorio();

  const id1 = await repo.salvarJogo(jogo('22511'));
  const id2 = await repo.salvarJogo(jogo('22511'));

  assert.equal(id1, id2);
  assert.equal(contar(banco, 'jogo'), 1);
});

test('salvarJogo guarda as plataformas como JSON e aproveita a desenvolvedora que vier depois', async () => {
  const { repo, banco } = criarRepositorio();

  await repo.salvarJogo(jogo('1'));
  await repo.salvarJogo(jogo('1', { desenvolvedora: 'Nintendo EPD' }));

  const linha = banco.db.prepare('SELECT plataformas, desenvolvedora FROM jogo').get();
  assert.equal(linha.plataformas, '["Switch","Wii U"]');
  assert.equal(linha.desenvolvedora, 'Nintendo EPD');
});

test('adicionarNaBiblioteca cria o jogo com datas e devolve o model pronto', async () => {
  const { repo } = criarRepositorio();

  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO', 150);

  assert.equal(item.status, 'JOGANDO');
  assert.equal(item.minutosJogados, 150);
  assert.equal(item.nota, null);
  assert.equal(item.anotacao, '');
  assert.equal(item.dataConclusao, null);
  assert.equal(item.dataAdicao, item.ultimaInteracao);
  assert.deepEqual(item.jogo.plataformas, ['Switch', 'Wii U']);
});

test('adicionar o mesmo jogo duas vezes não cria duplicata', async () => {
  const { repo, banco } = criarRepositorio();

  await repo.adicionarNaBiblioteca(jogo('1'), 'NA_FILA');
  await assert.rejects(repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO'), JogoJaNaBibliotecaError);

  assert.equal(contar(banco, 'jogo_biblioteca'), 1);
});

test('status inicial CONCLUIDO já preenche dataConclusao', async () => {
  const { repo } = criarRepositorio();

  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'CONCLUIDO', 540);

  assert.equal(item.dataConclusao, item.dataAdicao);
});

test('Na fila sempre começa com 0 minutos', async () => {
  const { repo } = criarRepositorio();

  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'NA_FILA', 300);

  assert.equal(item.minutosJogados, 0);
});

test('estaNaBiblioteca e listarApiIdsSalvos', async () => {
  const { repo } = criarRepositorio();
  await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO');
  await repo.adicionarNaBiblioteca(jogo('2'), 'NA_FILA');

  assert.equal(await repo.estaNaBiblioteca('1'), true);
  assert.equal(await repo.estaNaBiblioteca('999'), false);
  assert.deepEqual((await repo.listarApiIdsSalvos()).sort(), ['1', '2']);
});

// ---------- Cartão: listar, buscar, atualizar e remover ----------

test('listarBiblioteca ordena pela última interação (mais recente primeiro)', async () => {
  const { repo } = criarRepositorio();
  const a = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO');
  await repo.adicionarNaBiblioteca(jogo('2'), 'NA_FILA');

  await repo.atualizarMinutos(a.id, 60); // jogo 1 passa a ser o mais recente

  const lista = await repo.listarBiblioteca();
  assert.deepEqual(lista.map((j) => j.jogo.apiId), ['1', '2']);
});

test('buscarPorId devolve o jogo ou null', async () => {
  const { repo } = criarRepositorio();
  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO');

  assert.equal((await repo.buscarPorId(item.id))?.jogo.nome, 'Jogo 1');
  assert.equal(await repo.buscarPorId('nao-existe'), null);
});

test('atualizarAnotacao e atualizarMinutos gravam e atualizam ultimaInteracao', async () => {
  const { repo } = criarRepositorio();
  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO', 60);

  await repo.atualizarAnotacao(item.id, 'Falta o castelo');
  await repo.atualizarMinutos(item.id, 2550);

  const atualizado = await repo.buscarPorId(item.id);
  assert.equal(atualizado.anotacao, 'Falta o castelo');
  assert.equal(atualizado.minutosJogados, 2550);
  assert.ok(atualizado.ultimaInteracao > item.ultimaInteracao);
});

test('mudarStatus só grava os campos recebidos', async () => {
  const { repo } = criarRepositorio();
  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO');

  await repo.mudarStatus(item.id, { status: 'CONCLUIDO', nota: 5, dataConclusao: '2026-11-14T15:00:00.000Z' });

  const atualizado = await repo.buscarPorId(item.id);
  assert.equal(atualizado.status, 'CONCLUIDO');
  assert.equal(atualizado.nota, 5);
  assert.equal(atualizado.dataConclusao, '2026-11-14T15:00:00.000Z');
  assert.ok(atualizado.ultimaInteracao > item.ultimaInteracao);
});

test('removerJogo apaga da biblioteca, mas mantém o jogo na tabela jogo (cache)', async () => {
  const { repo, banco } = criarRepositorio();
  const item = await repo.adicionarNaBiblioteca(jogo('1'), 'JOGANDO');

  await repo.removerJogo(item.id);

  assert.equal(await repo.buscarPorId(item.id), null);
  assert.equal(contar(banco, 'jogo_biblioteca'), 0);
  assert.equal(contar(banco, 'jogo'), 1);
});

test('parâmetros protegem contra texto do usuário no SQL', async () => {
  const { repo } = criarRepositorio();
  const item = await repo.adicionarNaBiblioteca(jogo('1', { nome: "Jogo'; DROP TABLE jogo; --" }), 'JOGANDO');

  await repo.atualizarAnotacao(item.id, "'); DELETE FROM jogo_biblioteca; --");

  const salvo = await repo.buscarPorId(item.id);
  assert.equal(salvo.jogo.nome, "Jogo'; DROP TABLE jogo; --");
  assert.equal(salvo.anotacao, "'); DELETE FROM jogo_biblioteca; --");
});

// ---------- Cartão: estatísticas da Home ----------

test('estatísticas: abandonado não conta como concluído e Na fila soma 0h', async () => {
  const { repo } = criarRepositorio();
  await repo.adicionarNaBiblioteca(jogo('1'), 'CONCLUIDO', 600);
  await repo.adicionarNaBiblioteca(jogo('2'), 'ABANDONADO', 120);
  await repo.adicionarNaBiblioteca(jogo('3'), 'NA_FILA', 999); // Na fila sempre entra com 0 minutos
  await repo.adicionarNaBiblioteca(jogo('4'), 'JOGANDO', 90);

  const estatisticas = await repo.obterEstatisticas();

  assert.equal(estatisticas.totalConcluidos, 1);
  assert.deepEqual(estatisticas.quantidadePorStatus, { NA_FILA: 1, JOGANDO: 1, CONCLUIDO: 1, ABANDONADO: 1 });
  assert.equal(estatisticas.horasTotais, 13); // 600 + 120 + 0 + 90 = 810 min = 13h
});

test('estatísticas com a biblioteca vazia voltam zeradas', async () => {
  const { repo } = criarRepositorio();
  const estatisticas = await repo.obterEstatisticas();

  assert.equal(estatisticas.totalConcluidos, 0);
  assert.equal(estatisticas.horasTotais, 0);
  assert.deepEqual(estatisticas.quantidadePorStatus, { NA_FILA: 0, JOGANDO: 0, CONCLUIDO: 0, ABANDONADO: 0 });
});
