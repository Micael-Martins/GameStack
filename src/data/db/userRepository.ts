import { Usuario } from '../../models/Usuario';
import { obterBanco } from './database';

// Formato da linha como ela vem do SQLite.
// O SQLite não tem boolean: guarda 1 (sim) ou 0 (não).
type UserRow = {
  id: string;
  nome: string;
  notificacaoAtiva: number;
  horarioNotificacao: string | null;
};

const DEFAULT_REMINDER_TIME = '19:00';

// Converte a linha do banco para o model Usuario que o app usa.
function rowToUser(row: UserRow): Usuario {
  return {
    id: row.id,
    nome: row.nome,
    notificacaoAtiva: row.notificacaoAtiva === 1,
    horarioNotificacao: row.horarioNotificacao ?? DEFAULT_REMINDER_TIME,
  };
}

// Busca o usuário do app (só existe um).
export async function getUser(): Promise<Usuario | null> {
  const db = await obterBanco();
  const row = await db.getFirstAsync<UserRow>('SELECT * FROM usuario LIMIT 1');
  return row ? rowToUser(row) : null;
}

// Salva o nome e se os lembretes estão ligados.
export async function saveProfile(name: string, remindersEnabled: boolean): Promise<void> {
  const db = await obterBanco();
  await db.runAsync(
    `UPDATE usuario
       SET nome = ?, notificacaoAtiva = ?, horarioNotificacao = COALESCE(horarioNotificacao, ?)`,
    [name, remindersEnabled ? 1 : 0, DEFAULT_REMINDER_TIME]
  );
}