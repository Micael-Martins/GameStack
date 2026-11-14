import { createStore } from 'zustand/vanilla';

import type { criarBibliotecaRepository } from '../data/db/bibliotecaRepositoryBase';
import type { Jogo } from '../models/Jogo';
import type { JogoBiblioteca } from '../models/JogoBiblioteca';
import type { StatusJogo } from '../models/StatusJogo';
import type { aplicarMudancaStatus } from './regrasStatus';

// Store da biblioteca, sem depender do Expo (o bibliotecaStore.ts liga ao
// repositório de verdade; os testes ligam a um SQLite em memória).

type RepositorioBiblioteca = Pick<
  ReturnType<typeof criarBibliotecaRepository>,
  | 'listarBiblioteca'
  | 'buscarPorId'
  | 'adicionarNaBiblioteca'
  | 'atualizarMinutos'
  | 'atualizarAnotacao'
  | 'mudarStatus'
  | 'removerJogo'
>;

export interface AtualizacaoJogo {
  minutosJogados?: number;
  anotacao?: string;
}

export interface EstadoBiblioteca {
  jogos: JogoBiblioteca[];
  carregando: boolean;
  erro: string | null;
  carregar: () => Promise<void>;
  adicionar: (jogo: Jogo, status: StatusJogo, minutos?: number) => Promise<JogoBiblioteca>;
  atualizar: (id: string, campos: AtualizacaoJogo) => Promise<void>;
  mudarStatus: (id: string, novoStatus: StatusJogo, nota?: number | null) => Promise<void>;
  remover: (id: string) => Promise<void>;
}

// Mais recente primeiro (as datas são texto ISO, então dá para comparar como texto).
function ordenarPorInteracao(jogos: JogoBiblioteca[]): JogoBiblioteca[] {
  return [...jogos].sort((a, b) => b.ultimaInteracao.localeCompare(a.ultimaInteracao));
}

export interface DependenciasStore {
  repositorio: RepositorioBiblioteca;
  // As regras de status entram por aqui (assim a store usa sempre a mesma função).
  regras: typeof aplicarMudancaStatus;
  agora?: () => Date;
}

export function criarBibliotecaStore({ repositorio, regras, agora = () => new Date() }: DependenciasStore) {
  return createStore<EstadoBiblioteca>()((set, get) => {
    // Relê um jogo do banco e troca na lista.
    async function recarregarJogo(id: string): Promise<void> {
      const atualizado = await repositorio.buscarPorId(id);
      if (!atualizado) return;
      set({ jogos: ordenarPorInteracao(get().jogos.map((j) => (j.id === id ? atualizado : j))) });
    }

    function buscarNaLista(id: string): JogoBiblioteca {
      const jogo = get().jogos.find((j) => j.id === id);
      if (!jogo) throw new Error('Jogo não encontrado na biblioteca.');
      return jogo;
    }

    return {
      jogos: [],
      carregando: false,
      erro: null,

      // Busca do repositório; chamada uma vez quando o app abre.
      carregar: async () => {
        set({ carregando: true, erro: null });
        try {
          const jogos = await repositorio.listarBiblioteca();
          set({ jogos, carregando: false });
        } catch (erro) {
          console.warn('Erro ao carregar a biblioteca.', erro);
          set({ carregando: false, erro: 'Não foi possível abrir a biblioteca.' });
        }
      },

      adicionar: async (jogo, status, minutos = 0) => {
        const novo = await repositorio.adicionarNaBiblioteca(jogo, status, minutos);
        set({ jogos: ordenarPorInteracao([novo, ...get().jogos.filter((j) => j.id !== novo.id)]) });
        return novo;
      },

      atualizar: async (id, campos) => {
        buscarNaLista(id);
        if (campos.minutosJogados !== undefined) await repositorio.atualizarMinutos(id, campos.minutosJogados);
        if (campos.anotacao !== undefined) await repositorio.atualizarAnotacao(id, campos.anotacao.trim());
        await recarregarJogo(id);
      },

      mudarStatus: async (id, novoStatus, nota) => {
        const atual = buscarNaLista(id);
        await repositorio.mudarStatus(id, regras(atual, novoStatus, nota, agora()));
        await recarregarJogo(id);
      },

      remover: async (id) => {
        await repositorio.removerJogo(id);
        set({ jogos: get().jogos.filter((j) => j.id !== id) });
      },
    };
  });
}

// ---------- Seletores prontos ----------
// Funções puras sobre a lista (que já vem ordenada pela última interação).
// Nas telas, use com useMemo: const destaque = useMemo(() => jogandoAgora(jogos), [jogos]);

export function jogandoAgora(jogos: JogoBiblioteca[]): JogoBiblioteca | null {
  return jogos.find((j) => j.status === 'JOGANDO') ?? null;
}

export function recentes(jogos: JogoBiblioteca[], n: number, excluirId?: string): JogoBiblioteca[] {
  return jogos.filter((j) => j.id !== excluirId).slice(0, n);
}

export function porStatus(jogos: JogoBiblioteca[], status: StatusJogo): JogoBiblioteca[] {
  return jogos.filter((j) => j.status === status);
}
