/*
    Responsável por criar, abrir e configurar o banco de dados do aplicativo.
*/

import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';

import { APAGAR_DADOS, CRIAR_TABELAS } from './esquema';

// Abre o banco, cria as tabelas e o usuário padrão (só na primeira vez).
export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('backlogzero.db');

  // Ativa a verificação das chaves estrangeiras.
  await db.execAsync(`PRAGMA foreign_keys = ON;`);

  await db.execAsync(CRIAR_TABELAS);

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
};

let bancoPromise: ReturnType<typeof initDatabase> | null = null;

// Abre o banco uma única vez e devolve sempre a mesma conexão (usado pelos repositórios).
export function obterBanco(): ReturnType<typeof initDatabase> {
  if (!bancoPromise) {
    bancoPromise = initDatabase().catch((erro) => {
      bancoPromise = null; // permite tentar de novo
      throw erro;
    });
  }
  return bancoPromise;
}

// Usado pelo "Apagar todos os dados" das Configurações.
export async function apagarDadosDoBanco(): Promise<void> {
  const db = await obterBanco();
  await db.execAsync(APAGAR_DADOS);
}
