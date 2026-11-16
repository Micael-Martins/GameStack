import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import test from 'node:test';

import { criarBibliotecaRepository } from '../src/data/db/bibliotecaRepositoryBase.ts';
import { CRIAR_TABELAS } from '../src/data/db/esquema.ts';
import { criarBibliotecaStore, estadoDaBiblioteca, jogandoAgora, porStatus, recentes } from '../src/store/bibliotecaStoreBase.ts';
import { aplicarMudancaStatus } from '../src/store/regrasStatus.ts';

// Store ligada ao repositório de verdade, com um SQLite em memória do Node.
function criarStore(aoMudarJogos) {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(CRIAR_TABELAS);
  db.prepare('INSERT INTO usuario (id, nome, notificacaoAtiva) VALUES (?, ?, ?)').run('u1', 'Jogador', 0);
  db.prepare('INSERT INTO biblioteca (id, usuarioId) VALUES (?, ?)').run('b1', 'u1');
  const banco = {
    runAsync: async (sql, params = []) => db.prepare(sql).run(...params),
    getFirstAsync: async (sql, params = []) => db.prepare(sql).get(...params) ?? null,
    getAllAsync: async (sql, params = []) => db.prepare(sql).all(...params),
  };
  let contador = 0;
  let relogio = Date.parse('2026-11-14T12:00:00.000Z');
  const agora = () => new Date((relogio += 60_000)); // cada operação 1 minuto depois
  const repositorio = criarBibliotecaRepository({
    obterBanco: async () => banco,
    gerarId: () => `id-${++contador}`,
    agora,
  });
  const store = criarBibliotecaStore({ repositorio, regras: aplicarMudancaStatus, agora, aoMudarJogos });
  store.novaStoreNoMesmoBanco = () => criarBibliotecaStore({ repositorio, regras: aplicarMudancaStatus, agora });
  return store;
}

function jogo(apiId, tempoMedio = 50) {
  return {
    id: '',
    apiId,
    origemAPI: 'RAWG',
    nome: `Jogo ${apiId}`,
    imagemURL: null,
    genero: 'Aventura',
    desenvolvedora: '',
    anoLancamento: 2017,
    tempoMedio,
    plataformas: ['Switch'],
  };
}

test('carregar busca a biblioteca salva no banco (como ao reabrir o app)', async () => {
  const store = criarStore();
  await store.getState().adicionar(jogo('1'), 'JOGANDO', 60);

  const reaberta = store.novaStoreNoMesmoBanco(); // store nova, lista vazia
  assert.equal(reaberta.getState().jogos.length, 0);

  await reaberta.getState().carregar();

  assert.equal(reaberta.getState().carregando, false);
  assert.equal(reaberta.getState().erro, null);
  assert.equal(reaberta.getState().jogos[0].jogo.apiId, '1');
});

test('adicionar coloca o jogo no topo da lista', async () => {
  const store = criarStore();
  await store.getState().adicionar(jogo('1'), 'NA_FILA');
  await store.getState().adicionar(jogo('2'), 'JOGANDO', 120);

  assert.deepEqual(store.getState().jogos.map((j) => j.jogo.apiId), ['2', '1']);
});

test('atualizar grava horas e anotação e reordena pela última interação', async () => {
  const store = criarStore();
  const a = await store.getState().adicionar(jogo('1'), 'JOGANDO', 60);
  await store.getState().adicionar(jogo('2'), 'JOGANDO', 30);

  await store.getState().atualizar(a.id, { minutosJogados: 2550, anotacao: '  Falta o castelo  ' });

  const [primeiro] = store.getState().jogos;
  assert.equal(primeiro.id, a.id);
  assert.equal(primeiro.minutosJogados, 2550);
  assert.equal(primeiro.anotacao, 'Falta o castelo');
});

test('mudarStatus usa as regras: concluir grava nota e data; voltar a jogar limpa as duas', async () => {
  const store = criarStore();
  const item = await store.getState().adicionar(jogo('1'), 'JOGANDO', 60);

  await store.getState().mudarStatus(item.id, 'CONCLUIDO', 5);
  let atual = store.getState().jogos.find((j) => j.id === item.id);
  assert.equal(atual.status, 'CONCLUIDO');
  assert.equal(atual.nota, 5);
  assert.ok(atual.dataConclusao);

  await store.getState().mudarStatus(item.id, 'JOGANDO');
  atual = store.getState().jogos.find((j) => j.id === item.id);
  assert.equal(atual.nota, null);
  assert.equal(atual.dataConclusao, null);
});

test('remover tira o jogo da lista', async () => {
  const store = criarStore();
  const item = await store.getState().adicionar(jogo('1'), 'JOGANDO');

  await store.getState().remover(item.id);

  assert.equal(store.getState().jogos.length, 0);
});

test('mudança feita por uma tela aparece para quem está ouvindo a store', async () => {
  const store = criarStore();
  const item = await store.getState().adicionar(jogo('1'), 'NA_FILA');
  const vistos = [];
  const parar = store.subscribe((estado) => vistos.push(estado.jogos[0]?.status));

  await store.getState().mudarStatus(item.id, 'JOGANDO');
  parar();

  assert.equal(vistos.at(-1), 'JOGANDO');
});

test('seletores: jogandoAgora, recentes(n) e porStatus(status)', async () => {
  const store = criarStore();
  await store.getState().adicionar(jogo('1'), 'JOGANDO', 60);
  await store.getState().adicionar(jogo('2'), 'NA_FILA');
  const maisRecente = await store.getState().adicionar(jogo('3'), 'JOGANDO', 30);
  const { jogos } = store.getState();

  assert.equal(jogandoAgora(jogos)?.id, maisRecente.id);
  assert.deepEqual(recentes(jogos, 2).map((j) => j.jogo.apiId), ['3', '2']);
  assert.deepEqual(recentes(jogos, 2, maisRecente.id).map((j) => j.jogo.apiId), ['2', '1']);
  assert.deepEqual(porStatus(jogos, 'JOGANDO').map((j) => j.jogo.apiId), ['3', '1']);
  assert.equal(jogandoAgora([]), null);
});

test('limpar esvazia a lista (usado pelo Apagar todos os dados)', async () => {
  const store = criarStore();
  await store.getState().adicionar(jogo('1'), 'JOGANDO');

  store.getState().limpar();

  assert.deepEqual(store.getState().jogos, []);
});

// Espera os avisos que a store dispara sem await.
const esperarAvisos = () => new Promise((resolver) => setImmediate(resolver));

test('toda mudança nos jogos avisa o app (para reagendar o lembrete)', async () => {
  let avisos = 0;
  const store = criarStore(async () => {
    avisos++;
  });

  const novo = await store.getState().adicionar(jogo('1'), 'NA_FILA');
  await store.getState().atualizar(novo.id, { minutosJogados: 30 });
  await store.getState().mudarStatus(novo.id, 'JOGANDO');
  await store.getState().remover(novo.id);
  await esperarAvisos();

  assert.equal(avisos, 4);
});

test('carregar e limpar não avisam (não mudam jogos no banco)', async () => {
  let avisos = 0;
  const store = criarStore(async () => {
    avisos++;
  });

  await store.getState().carregar();
  store.getState().limpar();
  await esperarAvisos();

  assert.equal(avisos, 0);
});

test('se a mudança falhar, não avisa', async () => {
  let avisos = 0;
  const store = criarStore(async () => {
    avisos++;
  });

  await assert.rejects(store.getState().mudarStatus('nao-existe', 'JOGANDO'), /não encontrado/);
  await assert.rejects(store.getState().atualizar('nao-existe', { minutosJogados: 10 }), /não encontrado/);
  await esperarAvisos();

  assert.equal(avisos, 0);
});

test('falha no aviso não desfaz a mudança', async () => {
  const avisoOriginal = console.warn;
  console.warn = () => {};
  try {
    const store = criarStore(async () => {
      throw new Error('Notificações indisponíveis');
    });

    await store.getState().adicionar(jogo('1'), 'JOGANDO');
    await esperarAvisos();

    assert.equal(store.getState().jogos.length, 1);
  } finally {
    console.warn = avisoOriginal;
  }
});

test('estado da tela: erro ao abrir o banco mostra erro, não "Adicione seu primeiro jogo"', () => {
  assert.equal(estadoDaBiblioteca(false, 'Não foi possível abrir a biblioteca.', 0), 'ERRO');
  assert.equal(estadoDaBiblioteca(false, null, 0), 'VAZIA');
  assert.equal(estadoDaBiblioteca(true, null, 0), 'CARREGANDO');
});

test('estado da tela: com jogos, mostra a lista mesmo carregando ou com erro', () => {
  assert.equal(estadoDaBiblioteca(false, null, 3), 'LISTA');
  assert.equal(estadoDaBiblioteca(true, null, 3), 'LISTA');
  assert.equal(estadoDaBiblioteca(false, 'falhou', 3), 'LISTA');
});
