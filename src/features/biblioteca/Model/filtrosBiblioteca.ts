import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { StatusJogo } from '../../../models/StatusJogo';

export type FiltroBiblioteca = 'TODOS' | StatusJogo;

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
