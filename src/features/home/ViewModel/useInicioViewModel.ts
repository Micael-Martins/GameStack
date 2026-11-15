import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { obterEstatisticas } from "../../../data/db/bibliotecaRepository";
import { estadoDaBiblioteca } from "../../biblioteca/Model/filtrosBiblioteca";
import { obterUsuario } from "../../../data/db/userRepository";
import { buscarJogosPopulares } from "../../../data/services/rawgService";
import type { Estatisticas } from "../../../models/Estatisticas";
import type { Jogo } from "../../../models/Jogo";
import {
  porStatus,
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
export function useInicioViewModel() {
  // Jogos vêm da store compartilhada: mudou em qualquer tela, a Home atualiza sozinha.
  const games = useBibliotecaStore((s) => s.jogos);
  const loading = useBibliotecaStore((s) => s.carregando);
  const erroBiblioteca = useBibliotecaStore((s) => s.erro);
  const recarregarBiblioteca = useBibliotecaStore((s) => s.carregar);
  const addGame = useBibliotecaStore((s) => s.adicionar);

  const [name, setName] = useState(DEFAULT_NAME);
  const [stats, setStats] = useState<Estatisticas>(EMPTY_STATS);
  const [popularGames, setPopularGames] = useState<Jogo[]>([]);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [carregandoEstatisticas, setCarregandoEstatisticas] = useState(true);
  const [carregandoPopulares, setCarregandoPopulares] = useState(false);

  const estadoBiblioteca = estadoDaBiblioteca(loading, erroBiblioteca, games.length);
  const isEmpty = estadoBiblioteca === "VAZIA";

  // Atualiza o perfil quando a Home recebe foco.
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      setCarregandoPerfil(true);

      obterUsuario()
        .then((user) => {
          if (ativo) setName(user?.nome || DEFAULT_NAME);
        })
        .catch((e) => console.warn("Erro ao ler o usuário:", e))
        .finally(() => {
          if (ativo) setCarregandoPerfil(false);
        });

      return () => {
        ativo = false;
      };
    }, []),
  );

  // Atualiza as estatísticas quando a biblioteca muda.
  useEffect(() => {
    let ativo = true;
    setCarregandoEstatisticas(true);

    obterEstatisticas()
      .then((dados) => {
        if (ativo) setStats(dados);
      })
      .catch((e) => console.warn("Erro ao calcular estatísticas:", e))
      .finally(() => {
        if (ativo) setCarregandoEstatisticas(false);
      });

    return () => {
      ativo = false;
    };
  }, [games]);

  // Os populares são opcionais: a Home continua funcionando sem internet.
  useEffect(() => {
    if (!isEmpty || popularGames.length > 0) {
      setCarregandoPopulares(false);
      return;
    }

    const controller = new AbortController();
    let ativo = true;
    setCarregandoPopulares(true);

    buscarJogosPopulares(10, { signal: controller.signal })
      .then((jogos) => {
        if (ativo) setPopularGames(jogos);
      })
      .catch((e) => {
        if (ativo) console.warn("Sem populares da RAWG:", e);
      })
      .finally(() => {
        if (ativo) setCarregandoPopulares(false);
      });

    return () => {
      ativo = false;
      controller.abort();
    };
  }, [isEmpty, popularGames.length]);

  // Carrossel: todos os "Jogando", do mais recente para o mais antigo.
  const playingGames = useMemo(() => porStatus(games, "JOGANDO"), [games]);
  // Recentes: os que NÃO estão no carrossel, para não repetir.
  const recentGames = useMemo(
    () =>
      recentes(
        games.filter((j) => j.status !== "JOGANDO"),
        5,
      ),
    [games],
  );

  // SÓ EM DESENVOLVIMENTO: põe 3 jogos populares na biblioteca para testar a Home cheia.
  async function addTestGames() {
    const [first, second, third] = popularGames;
    if (first) await addGame(first, "JOGANDO", 42 * 60);
    if (second) await addGame(second, "CONCLUIDO", 9 * 60);
    if (third) await addGame(third, "NA_FILA");
  }

  return {
    name,
    isEmpty,
    estadoBiblioteca,
    carregandoDados: carregandoPerfil || carregandoEstatisticas,
    carregandoPopulares,
    erroBiblioteca,
    tentarNovamente: () => void recarregarBiblioteca(),
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
