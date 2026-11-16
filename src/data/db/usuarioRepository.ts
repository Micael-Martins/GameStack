import { Usuario } from '../../models/Usuario';
import { obterBanco } from './database';

// Formato da linha como ela vem do SQLite.
// O SQLite não tem boolean: guarda 1 (sim) ou 0 (não).
type LinhaUsuario = {
  id: string;
  nome: string;
  notificacaoAtiva: number;
  horarioNotificacao: string | null;
};

const HORARIO_PADRAO = '19:00';

// Converte a linha do banco para o model Usuario que o app usa.
function linhaParaUsuario(linha: LinhaUsuario): Usuario {
  return {
    id: linha.id,
    nome: linha.nome,
    notificacaoAtiva: linha.notificacaoAtiva === 1,
    horarioNotificacao: linha.horarioNotificacao ?? HORARIO_PADRAO,
  };
}

// Busca o usuário do app (só existe um).
export async function obterUsuario(): Promise<Usuario | null> {
  const db = await obterBanco();
  const linha = await db.getFirstAsync<LinhaUsuario>('SELECT * FROM usuario LIMIT 1');
  return linha ? linhaParaUsuario(linha) : null;
}

// Salva o nome e se os lembretes estão ligados.
export async function salvarPerfil(nome: string, lembretesAtivos: boolean): Promise<void> {
  const db = await obterBanco();
  await db.runAsync(
    `UPDATE usuario
       SET nome = ?, notificacaoAtiva = ?, horarioNotificacao = COALESCE(horarioNotificacao, ?)`,
    [nome, lembretesAtivos ? 1 : 0, HORARIO_PADRAO]
  );
}

// Salva se os lembretes estão ligados e o horário ("HH:MM").
export async function salvarLembretes(lembretesAtivos: boolean, horario: string): Promise<void> {
  const db = await obterBanco();
  await db.runAsync('UPDATE usuario SET notificacaoAtiva = ?, horarioNotificacao = ?', [
    lembretesAtivos ? 1 : 0,
    horario,
  ]);
}
