import type { MudancaStatus } from '../data/db/bibliotecaRepositoryBase';
import type { JogoBiblioteca } from '../models/JogoBiblioteca';
import type { StatusJogo } from '../models/StatusJogo';

// Regras de mudança de status, num lugar só, para nenhuma tela aplicar diferente.
// A store e o painel "Mudar status" usam esta função; o repositório só grava.
//
// - Indo para CONCLUIDO: dataConclusao = agora e grava a nota recebida.
// - Saindo de CONCLUIDO: limpa dataConclusao.
// - A nota (1 a 5) só existe em CONCLUIDO ou ABANDONADO:
//   ABANDONADO mantém a nota se já tiver; JOGANDO e NA_FILA nunca têm nota.
// - ABANDONADO não conta como concluído (não tem dataConclusao).
// - Toda mudança atualiza ultimaInteracao: o repositório faz isso ao gravar.

export function notaValida(nota: number | null | undefined): nota is number {
  return typeof nota === 'number' && Number.isInteger(nota) && nota >= 1 && nota <= 5;
}

export function aplicarMudancaStatus(
  jogoAtual: Pick<JogoBiblioteca, 'status' | 'nota' | 'dataConclusao'>,
  novoStatus: StatusJogo,
  nota?: number | null,
  agora: Date = new Date(),
): MudancaStatus {
  switch (novoStatus) {
    case 'CONCLUIDO':
      return {
        status: 'CONCLUIDO',
        nota: notaValida(nota) ? nota : jogoAtual.nota,
        dataConclusao: agora.toISOString(),
      };
    case 'ABANDONADO':
      return {
        status: 'ABANDONADO',
        nota: notaValida(nota) ? nota : jogoAtual.nota,
        dataConclusao: null,
      };
    case 'JOGANDO':
    case 'NA_FILA':
      return { status: novoStatus, nota: null, dataConclusao: null };
  }
}
