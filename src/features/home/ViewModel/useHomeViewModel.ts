import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { pedirPermissao, reagendarLembrete } from '../../../data/services/notificationService';
import { obterEstatisticas } from '../../../data/db/bibliotecaRepository';
import { getUser } from '../../../data/db/userRepository';
import { buscarJogosPopulares } from '../../../data/services/rawgService';
import type { Estatisticas } from '../../../models/Estatisticas';
import type { Jogo } from '../../../models/Jogo';
import { porStatus, recentes, useBibliotecaStore } from '../../../store/bibliotecaStore';

const DEFAULT_NAME = 'Jogador';

const EMPTY_STATS: Estatisticas = {
  totalConcluidos: 0,
  horasTotais: 0,
  quantidadePorStatus: { NA_FILA: 0, JOGANDO: 0, CONCLUIDO: 0, ABANDONADO: 0 },
};

// Toda a lógica da Home. A View só mostra o que este hook devolve.
export function useHomeViewModel() {
  // Jogos vêm da store compartilhada: mudou em qualquer tela, a Home atualiza sozinha.
  const games = useBibliotecaStore((s) => s.jogos);
  const loading = useBibliotecaStore((s) => s.carregando);
  const addGame = useBibliotecaStore((s) => s.adicionar);

  const [name, setName] = useState(DEFAULT_NAME);
  const [stats, setStats] = useState<Estatisticas>(EMPTY_STATS);
  const [popularGames, setPopularGames] = useState<Jogo[]>([]);

  const isEmpty = !loading && games.length === 0;

  // Nome: relê quando a aba ganha foco (pode ter mudado em Configurações).
  useFocusEffect(
    useCallback(() => {
      getUser()
        .then((user) => setName(user?.nome || DEFAULT_NAME))
        .catch((e) => console.warn('Erro ao ler o usuário:', e));
    }, []),
  );

  // Estatísticas (SQL): recalcula toda vez que a lista de jogos muda.
  useEffect(() => {
    obterEstatisticas()
      .then(setStats)
      .catch((e) => console.warn('Erro ao calcular estatísticas:', e));
  }, [games]);

  // Populares da RAWG: só busca quando a biblioteca está vazia, e uma vez só.
  useEffect(() => {
    if (!isEmpty || popularGames.length > 0) return;
    buscarJogosPopulares(10)
      .then(setPopularGames)
      .catch((e) => console.warn('Sem populares da RAWG:', e)); // sem internet: a seção some
  }, [isEmpty, popularGames.length]);

  // Carrossel: todos os "Jogando", do mais recente para o mais antigo.
  const playingGames = useMemo(() => porStatus(games, 'JOGANDO'), [games]);
  // Recentes: os que NÃO estão no carrossel, para não repetir.
  const recentGames = useMemo(() => recentes(games.filter((j) => j.status !== 'JOGANDO'), 2), [games]);

  // SÓ EM DESENVOLVIMENTO: põe 3 jogos populares na biblioteca para testar a Home cheia.
  async function addTestGames() {
    const [first, second, third] = popularGames;
    if (first) await addGame(first, 'JOGANDO', 42 * 60);
    if (second) await addGame(second, 'CONCLUIDO', 9 * 60);
    if (third) await addGame(third, 'NA_FILA');
  }

  return {
    name,
    isEmpty,
    summary: {
      completed: stats.totalConcluidos,
      playing: stats.quantidadePorStatus.JOGANDO ?? 0,
      queued: stats.quantidadePorStatus.NA_FILA ?? 0,
      hours: stats.horasTotais,
    },
    playingGames,
    recentGames,
    popularGames,
    addTestGames: __DEV__ ? addTestGames : undefined,
  };
}