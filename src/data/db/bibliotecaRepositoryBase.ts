import type { Jogo } from '../../models/Jogo';
import type { JogoBiblioteca } from '../../models/JogoBiblioteca';
import type { StatusJogo } from '../../models/StatusJogo';
import type { Estatisticas } from '../../models/Estatisticas';

// Regras do repositório da biblioteca, sem depender do Expo.
// O bibliotecaRepository.ts liga estas funções ao expo-sqlite e ao expo-crypto;
// os testes ligam a um SQLite em memória do Node.
// Todas as consultas usam parâmetros (?), nunca texto do usuário colado no SQL.

export type ValorSQL = string | number | null;

// O que o repositório usa do banco (o SQLiteDatabase do expo-sqlite atende).
export interface BancoSQL {
  runAsync(sql: string, params: ValorSQL[]): Promise<unknown>;
  getFirstAsync<T>(sql: string, params: ValorSQL[]): Promise<T | null>;
  getAllAsync<T>(sql: string, params: ValorSQL[]): Promise<T[]>;
}

export interface DependenciasRepositorio {
  obterBanco: () => Promise<BancoSQL>;
  gerarId: () => string;
  agora?: () => Date;
}

// Campos gravados numa troca de status. As regras (dataConclusao, nota) ficam
// no cartão "Regras de mudança de status"; aqui só grava.
export interface MudancaStatus {
  status: StatusJogo;
  nota: number | null;
  dataConclusao: string | null;
}

export class JogoJaNaBibliotecaError extends Error {
  constructor() {
    super('Esse jogo já está na sua biblioteca.');
    this.name = 'JogoJaNaBibliotecaError';
  }
}

export interface LinhaJogoBiblioteca {
  id: string;
  status: StatusJogo;
  minutosJogados: number | null;
  nota: number | null;
  anotacao: string | null;
  dataAdicao: string;
  dataConclusao: string | null;
  ultimaInteracao: string;
  jogoId: string;
  apiId: string;
  origemAPI: string;
  nome: string;
  imagemURL: string | null;
  genero: string | null;
  desenvolvedora: string | null;
  anoLancamento: number | null;
  tempoMedio: number | null;
  plataformas: string | null;
}

const SELECT_JOGO_BIBLIOTECA = `
  SELECT
    jb.id, jb.status, jb.minutosJogados, jb.nota, jb.anotacao,
    jb.dataAdicao, jb.dataConclusao, jb.ultimaInteracao,
    j.id AS jogoId, j.apiId, j.origemAPI, j.nome, j.imagemURL, j.genero,
    j.desenvolvedora, j.anoLancamento, j.tempoMedio, j.plataformas
  FROM jogo_biblioteca jb
  INNER JOIN jogo j ON j.id = jb.jogoId
`;

function lerPlataformas(texto: string | null): string[] {
  if (!texto) return [];
  try {
    const valor: unknown = JSON.parse(texto);
    return Array.isArray(valor) ? valor.filter((p): p is string => typeof p === 'string') : [];
  } catch {
    return [];
  }
}

// Converte uma linha do SQLite (tudo em texto/número) no model JogoBiblioteca.
export function linhaParaModel(linha: LinhaJogoBiblioteca): JogoBiblioteca {
  return {
    id: linha.id,
    status: linha.status,
    minutosJogados: linha.minutosJogados ?? 0,
    nota: linha.nota ?? null,
    anotacao: linha.anotacao ?? '',
    dataAdicao: linha.dataAdicao,
    dataConclusao: linha.dataConclusao ?? null,
    ultimaInteracao: linha.ultimaInteracao,
    jogo: {
      id: linha.jogoId,
      apiId: linha.apiId,
      origemAPI: linha.origemAPI,
      nome: linha.nome,
      imagemURL: linha.imagemURL ?? null,
      genero: linha.genero ?? '',
      desenvolvedora: linha.desenvolvedora ?? '',
      anoLancamento: linha.anoLancamento ?? null,
      tempoMedio: linha.tempoMedio ?? 0,
      plataformas: lerPlataformas(linha.plataformas),
    },
  };
}

export function criarBibliotecaRepository({ obterBanco, gerarId, agora = () => new Date() }: DependenciasRepositorio) {
  const agoraISO = () => agora().toISOString();

  async function obterBibliotecaId(banco: BancoSQL): Promise<string> {
    const linha = await banco.getFirstAsync<{ id: string }>('SELECT id FROM biblioteca LIMIT 1', []);
    if (!linha) throw new Error('Biblioteca não encontrada. O banco foi inicializado?');
    return linha.id;
  }

  // ---------- Cartão: adicionar jogo na biblioteca ----------

  // Insere na tabela jogo só se o apiId ainda não existir (INSERT OR IGNORE)
  // e devolve o id local do jogo.
  async function salvarJogo(jogo: Jogo): Promise<string> {
    const banco = await obterBanco();
    await banco.runAsync(
      `INSERT OR IGNORE INTO jogo
        (id, apiId, origemAPI, nome, imagemURL, genero, desenvolvedora, anoLancamento, tempoMedio, plataformas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        gerarId(),
        jogo.apiId,
        jogo.origemAPI,
        jogo.nome,
        jogo.imagemURL,
        jogo.genero || null,
        jogo.desenvolvedora || null,
        jogo.anoLancamento,
        Math.max(0, Math.round(jogo.tempoMedio || 0)),
        JSON.stringify(jogo.plataformas ?? []),
      ],
    );

    // Se o jogo já estava salvo sem desenvolvedora, aproveita a que veio agora.
    if (jogo.desenvolvedora) {
      await banco.runAsync(
        'UPDATE jogo SET desenvolvedora = ? WHERE apiId = ? AND origemAPI = ? AND (desenvolvedora IS NULL OR desenvolvedora = \'\')',
        [jogo.desenvolvedora, jogo.apiId, jogo.origemAPI],
      );
    }

    const linha = await banco.getFirstAsync<{ id: string }>(
      'SELECT id FROM jogo WHERE apiId = ? AND origemAPI = ?',
      [jogo.apiId, jogo.origemAPI],
    );
    if (!linha) throw new Error('Não foi possível salvar o jogo.');
    return linha.id;
  }

  // Cria a linha em jogo_biblioteca com dataAdicao e ultimaInteracao = agora.
  // Se o status inicial for CONCLUIDO, já preenche dataConclusao.
  async function adicionarNaBiblioteca(jogo: Jogo, status: StatusJogo, minutos = 0): Promise<JogoBiblioteca> {
    const banco = await obterBanco();
    if (await estaNaBiblioteca(jogo.apiId, jogo.origemAPI)) throw new JogoJaNaBibliotecaError();

    const bibliotecaId = await obterBibliotecaId(banco);
    const jogoId = await salvarJogo(jogo);
    const id = gerarId();
    const data = agoraISO();
    const minutosValidos = status === 'NA_FILA' ? 0 : Math.max(0, Math.round(minutos));

    await banco.runAsync(
      `INSERT INTO jogo_biblioteca
        (id, bibliotecaId, jogoId, status, minutosJogados, nota, anotacao, dataAdicao, dataConclusao, ultimaInteracao)
       VALUES (?, ?, ?, ?, ?, NULL, '', ?, ?, ?)`,
      [id, bibliotecaId, jogoId, status, minutosValidos, data, status === 'CONCLUIDO' ? data : null, data],
    );

    const salvo = await buscarPorId(id);
    if (!salvo) throw new Error('Não foi possível adicionar o jogo.');
    return salvo;
  }

  async function estaNaBiblioteca(apiId: string, origemAPI = 'RAWG'): Promise<boolean> {
    const banco = await obterBanco();
    const linha = await banco.getFirstAsync<{ total: number }>(
      `SELECT COUNT(*) AS total FROM jogo_biblioteca jb
       INNER JOIN jogo j ON j.id = jb.jogoId
       WHERE j.apiId = ? AND j.origemAPI = ?`,
      [apiId, origemAPI],
    );
    return (linha?.total ?? 0) > 0;
  }

  async function listarApiIdsSalvos(): Promise<string[]> {
    const banco = await obterBanco();
    const linhas = await banco.getAllAsync<{ apiId: string }>(
      'SELECT j.apiId FROM jogo_biblioteca jb INNER JOIN jogo j ON j.id = jb.jogoId',
      [],
    );
    return linhas.map((l) => l.apiId);
  }

  // ---------- Cartão: listar, buscar, atualizar e remover ----------

  // JOIN entre jogo_biblioteca e jogo, mais recente primeiro.
  async function listarBiblioteca(): Promise<JogoBiblioteca[]> {
    const banco = await obterBanco();
    const linhas = await banco.getAllAsync<LinhaJogoBiblioteca>(
      `${SELECT_JOGO_BIBLIOTECA} ORDER BY jb.ultimaInteracao DESC`,
      [],
    );
    return linhas.map(linhaParaModel);
  }

  async function buscarPorId(id: string): Promise<JogoBiblioteca | null> {
    const banco = await obterBanco();
    const linha = await banco.getFirstAsync<LinhaJogoBiblioteca>(`${SELECT_JOGO_BIBLIOTECA} WHERE jb.id = ?`, [id]);
    return linha ? linhaParaModel(linha) : null;
  }

  async function atualizarAnotacao(id: string, texto: string): Promise<void> {
    const banco = await obterBanco();
    await banco.runAsync('UPDATE jogo_biblioteca SET anotacao = ?, ultimaInteracao = ? WHERE id = ?', [
      texto,
      agoraISO(),
      id,
    ]);
  }

  async function atualizarMinutos(id: string, minutos: number): Promise<void> {
    const banco = await obterBanco();
    await banco.runAsync('UPDATE jogo_biblioteca SET minutosJogados = ?, ultimaInteracao = ? WHERE id = ?', [
      Math.max(0, Math.round(minutos)),
      agoraISO(),
      id,
    ]);
  }

  // Só grava. As regras de status ficam no cartão do incremento 4.
  async function mudarStatus(id: string, mudanca: MudancaStatus): Promise<void> {
    const banco = await obterBanco();
    await banco.runAsync(
      'UPDATE jogo_biblioteca SET status = ?, nota = ?, dataConclusao = ?, ultimaInteracao = ? WHERE id = ?',
      [mudanca.status, mudanca.nota, mudanca.dataConclusao, agoraISO(), id],
    );
  }

  // Apaga de jogo_biblioteca; o jogo continua na tabela jogo como cache.
  async function removerJogo(id: string): Promise<void> {
    const banco = await obterBanco();
    await banco.runAsync('DELETE FROM jogo_biblioteca WHERE id = ?', [id]);
  }

    // ---------- Cartão: estatísticas da Home ----------

  // Quantos jogos foram concluídos (abandonados não contam).
  async function totalConcluidos(): Promise<number> {
    const banco = await obterBanco();
    const linha = await banco.getFirstAsync<{ total: number }>(
      "SELECT COUNT(*) AS total FROM jogo_biblioteca WHERE status = 'CONCLUIDO'",
      [],
    );
    return linha?.total ?? 0;
  }

  // Quantidade de jogos em cada status (GROUP BY). Status sem jogos voltam com 0.
  async function quantidadePorStatus(): Promise<Record<StatusJogo, number>> {
    const banco = await obterBanco();
    const linhas = await banco.getAllAsync<{ status: StatusJogo; total: number }>(
      'SELECT status, COUNT(*) AS total FROM jogo_biblioteca GROUP BY status',
      [],
    );
    const resultado: Record<StatusJogo, number> = { NA_FILA: 0, JOGANDO: 0, CONCLUIDO: 0, ABANDONADO: 0 };
    for (const linha of linhas) resultado[linha.status] = linha.total;
    return resultado;
  }

  // Soma dos minutos jogados, convertida em horas inteiras.
  async function horasTotais(): Promise<number> {
    const banco = await obterBanco();
    const linha = await banco.getFirstAsync<{ minutos: number | null }>(
      'SELECT SUM(minutosJogados) AS minutos FROM jogo_biblioteca',
      [],
    );
    return Math.floor((linha?.minutos ?? 0) / 60);
  }

  // Junta tudo no model Estatisticas (usado pela Home e pela tela Concluir).
  async function obterEstatisticas(): Promise<Estatisticas> {
    const [concluidos, porStatus, horas] = await Promise.all([
      totalConcluidos(),
      quantidadePorStatus(),
      horasTotais(),
    ]);
    return { totalConcluidos: concluidos, horasTotais: horas, quantidadePorStatus: porStatus };
  }

  return {
    salvarJogo,
    adicionarNaBiblioteca,
    estaNaBiblioteca,
    listarApiIdsSalvos,
    listarBiblioteca,
    buscarPorId,
    atualizarAnotacao,
    atualizarMinutos,
    mudarStatus,
    removerJogo,
    totalConcluidos,
    quantidadePorStatus,
    horasTotais,
    obterEstatisticas,
  };
}
