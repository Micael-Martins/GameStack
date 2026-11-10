import * as SQLite from 'expo-sqlite';

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('backlogzero.db');

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
    const defaultUserId = crypto.randomUUID ? crypto.randomUUID() : 'user-padrao-1';
    const defaultLibId = crypto.randomUUID ? crypto.randomUUID() : 'lib-padrao-1';

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
};