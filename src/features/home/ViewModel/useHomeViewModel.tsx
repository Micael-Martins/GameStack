import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

import { obterEstatisticas } from "../../../data/db/bibliotecaRepository";
import { obterUsuario } from "../../../data/db/userRepository";
import { buscarJogosPopulares } from "../../../data/services/rawgService";
import type { Estatisticas } from "../../../models/Estatisticas";
import type { Jogo } from "../../../models/Jogo";
import {
    jogandoAgora,
    recentes,
    useBibliotecaStore,
} from "../../../store/bibliotecaStore";

const DEFAULT_NAME = "Jogador";

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

  const [name, setName] = useState(DEFAULT_NAME);
  const [stats, setStats] = useState<Estatisticas>(EMPTY_STATS);
  const [popularGames, setPopularGames] = useState<Jogo[]>([]);

  const isEmpty = !loading && games.length === 0;

  // Nome: relê quando a aba ganha foco (pode ter mudado em Configurações).
  useFocusEffect(
    useCallback(() => {
      obterUsuario()
        .then((user) => setName(user?.nome || DEFAULT_NAME))
        .catch((e) => console.warn("Erro ao ler o usuário:", e));
    }, []),
  );

  // Estatísticas (SQL): recalcula toda vez que a lista de jogos muda.
  useEffect(() => {
    obterEstatisticas()
      .then(setStats)
      .catch((e) => console.warn("Erro ao calcular estatísticas:", e));
  }, [games]);

  // Populares da RAWG: só busca quando a biblioteca está vazia, e uma vez só.
  useEffect(() => {
    if (!isEmpty || popularGames.length > 0) return;
    buscarJogosPopulares(10)
      .then(setPopularGames)
      .catch((e) => console.warn("Sem populares da RAWG:", e)); // sem internet: a seção some
  }, [isEmpty, popularGames.length]);

  // Seletores prontos da store do Brunno
  const highlight = useMemo(() => jogandoAgora(games), [games]);
  const recentGames = useMemo(
    () => recentes(games, 2, highlight?.id),
    [games, highlight],
  );

  return {
    name,
    isEmpty,
    queueCount: stats.quantidadePorStatus.NA_FILA ?? 0,
    stats: {
      completed: stats.totalConcluidos,
      playing: stats.quantidadePorStatus.JOGANDO ?? 0,
      queued: stats.quantidadePorStatus.NA_FILA ?? 0,
      hours: stats.horasTotais,
    },
    highlight, // "Jogando agora" (próximas partes)
    recentGames, // "Jogados recentemente" (próximas partes)
    popularGames,
  };
}
