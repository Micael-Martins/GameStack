/*
    Responsável por criar, abrir e configurar o banco de dados do aplicativo.
*/

import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';


// armazena uma promessa de retorno do banco SQLite que pode ser nulo ou nao.
let openedDb: Promise<SQLite.SQLiteDatabase> | null = null;

// Abre o banco uma única vez e devolve sempre a mesma conexão.
// Todos os repositórios usam esta função.
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  // Se ainda não existir uma conexão, chama a função que abre o banco e cria as tabelas.
  if (!openedDb) {
    openedDb = openAndCreateTables();
  }
  // Devolve a conexão armazenada.
  return openedDb;
}

// responsável por abrir o banco e criar as tabelas.
async function openAndCreateTables() {
  // Abre o banco de dados chamado backlogzero.db.
  const db = await SQLite.openDatabaseAsync('backlogzero.db');

  // Ativa a verificação das chaves estrangeiras.
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuario (
      id TEXT PRIMARY KEY,
      nome TEXT NOT NULL,
      notificacaoAtiva INTEGER DEFAULT 0,
      horarioNotificacao TEXT
    );

    CREATE TABLE IF NOT EXISTS biblioteca (
      id TEXT PRIMARY KEY,
      usuarioId TEXT UNIQUE NOT NULL,
      FOREIGN KEY (usuarioId) REFERENCES usuario (id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS jogo (
      id TEXT PRIMARY KEY,
      apiId TEXT NOT NULL,
      origemAPI TEXT NOT NULL,
      nome TEXT NOT NULL,
      imagemURL TEXT,
      genero TEXT,
      desenvolvedora TEXT,
      anoLancamento INTEGER,
      tempoMedio INTEGER,
      plataformas TEXT,
      UNIQUE (apiId, origemAPI)
    );

    CREATE TABLE IF NOT EXISTS jogo_biblioteca (
      id TEXT PRIMARY KEY,
      bibliotecaId TEXT NOT NULL,
      jogoId TEXT NOT NULL,
      status TEXT CHECK(status IN ('NA_FILA', 'JOGANDO', 'CONCLUIDO', 'ABANDONADO')) NOT NULL,
      minutosJogados INTEGER DEFAULT 0,
      nota INTEGER CHECK(nota >= 1 AND nota <= 5 OR nota IS NULL),
      anotacao TEXT,
      dataAdicao TEXT NOT NULL,
      dataConclusao TEXT,
      ultimaInteracao TEXT NOT NULL,
      UNIQUE (bibliotecaId, jogoId),
      FOREIGN KEY (bibliotecaId) REFERENCES biblioteca (id) ON DELETE CASCADE,
      FOREIGN KEY (jogoId) REFERENCES jogo (id) ON DELETE CASCADE
    );
  `);

  const usuarioExistente = await db.getFirstAsync<{ id: string }>('SELECT id FROM usuario LIMIT 1');

  if (!usuarioExistente) {
    const defaultUserId = Crypto.randomUUID();
    const defaultLibId = Crypto.randomUUID();

    await db.runAsync(
      'INSERT INTO usuario (id, nome, notificacaoAtiva) VALUES (?, ?, ?)',
      [defaultUserId, 'Jogador', 0]
    );

    await db.runAsync(
      'INSERT INTO biblioteca (id, usuarioId) VALUES (?, ?)',
      [defaultLibId, defaultUserId]
    );
  }

  return db;
}