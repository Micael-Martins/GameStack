import { useStore } from 'zustand';

import * as repositorio from '../data/db/bibliotecaRepository';
import { criarBibliotecaStore, EstadoBiblioteca } from './bibliotecaStoreBase';
import { aplicarMudancaStatus } from './regrasStatus';

export { jogandoAgora, porStatus, recentes } from './bibliotecaStoreBase';
export type { AtualizacaoJogo, EstadoBiblioteca } from './bibliotecaStoreBase';

// Store compartilhada da biblioteca (Zustand). Home, Biblioteca e Detalhes leem
// daqui, então uma mudança feita numa tela aparece nas outras na hora.
export const bibliotecaStore = criarBibliotecaStore({ repositorio, regras: aplicarMudancaStatus });

// Hook para as telas: const jogos = useBibliotecaStore((s) => s.jogos);
export function useBibliotecaStore<T>(seletor: (estado: EstadoBiblioteca) => T): T {
  return useStore(bibliotecaStore, seletor);
}

// Para chamar fora de componentes (ex.: no App.tsx ao abrir o app).
export function carregarBiblioteca(): Promise<void> {
  return bibliotecaStore.getState().carregar();
}
