import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { StatusJogo } from '../../../models/StatusJogo';

export type FiltroBiblioteca = 'TODOS' | StatusJogo;
export type EstadoListaBiblioteca = 'CARREGANDO' | 'ERRO' | 'VAZIO' | 'SEM_RESULTADOS' | null;

export function resolverEstadoListaBiblioteca({
  carregando,
  erro,
  quantidadeTotal,
  quantidadeVisivel,
}: {
  carregando: boolean;
  erro: string | null;
  quantidadeTotal: number;
  quantidadeVisivel: number;
}): EstadoListaBiblioteca {
  if (carregando && quantidadeTotal === 0) return 'CARREGANDO';
  if (quantidadeTotal === 0 && erro) return 'ERRO';
  if (quantidadeTotal === 0) return 'VAZIO';
  if (quantidadeVisivel === 0) return 'SEM_RESULTADOS';
  return null;
}

export function filtrarBiblioteca(
  jogos: JogoBiblioteca[],
  filtro: FiltroBiblioteca,
  termo: string,
): JogoBiblioteca[] {
  const consulta = termo.trim().toLocaleLowerCase();

  return jogos.filter((item) => {
    const correspondeStatus = filtro === 'TODOS' || item.status === filtro;
    const correspondeNome = !consulta || item.jogo.nome.toLocaleLowerCase().includes(consulta);
    return correspondeStatus && correspondeNome;
  });
}

export function contarPorStatus(jogos: JogoBiblioteca[], status: StatusJogo): number {
  return jogos.filter((item) => item.status === status).length;
}
