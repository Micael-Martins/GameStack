import { useStore } from 'zustand';

import * as repositorio from '../data/db/bibliotecaRepository';
import { atualizarLembrete } from '../data/services/notificacaoService';
import { criarBibliotecaStore, EstadoBiblioteca } from './bibliotecaStoreBase';
import { aplicarMudancaStatus } from './regrasStatus';

export { estadoDaBiblioteca, jogandoAgora, porStatus, recentes } from './bibliotecaStoreBase';
export type { AtualizacaoJogo, EstadoBiblioteca, EstadoTelaBiblioteca } from './bibliotecaStoreBase';

// Store compartilhada da biblioteca (Zustand). Home, Biblioteca e Detalhes leem
// daqui, então uma mudança feita numa tela aparece nas outras na hora.
// Toda mudança nos jogos reagenda o lembrete dos 5 dias (as telas não precisam lembrar disso).
export const bibliotecaStore = criarBibliotecaStore({
  repositorio,
  regras: aplicarMudancaStatus,
  aoMudarJogos: atualizarLembrete,
});

// Hook para as telas: const jogos = useBibliotecaStore((s) => s.jogos);
export function useBibliotecaStore<T>(seletor: (estado: EstadoBiblioteca) => T): T {
  return useStore(bibliotecaStore, seletor);
}

// Para chamar fora de componentes (ex.: no App.tsx ao abrir o app).
export function carregarBiblioteca(): Promise<void> {
  return bibliotecaStore.getState().carregar();
}
