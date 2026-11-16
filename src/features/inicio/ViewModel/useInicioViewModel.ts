import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";

import { obterEstatisticas } from "../../../data/db/bibliotecaRepository";
import { obterUsuario } from "../../../data/db/usuarioRepository";
import { buscarJogosPopulares } from "../../../data/services/rawgService";
import type { Estatisticas } from "../../../models/Estatisticas";
import type { Jogo } from "../../../models/Jogo";
import {
    estadoDaBiblioteca,
    porStatus,
    recentes,
    useBibliotecaStore,
} from "../../../store/bibliotecaStore";

const NOME_PADRAO = "Jogador";
const QUANTIDADE_RECENTES = 5;

const ESTATISTICAS_ZERADAS: Estatisticas = {
  totalConcluidos: 0,
  horasTotais: 0,
  quantidadePorStatus: { NA_FILA: 0, JOGANDO: 0, CONCLUIDO: 0, ABANDONADO: 0 },
};

// Toda a lógica da tela Início (Home). A View só mostra o que este hook devolve.
export function useInicioViewModel() {
  // Jogos vêm da store compartilhada: mudou em qualquer tela, a Home atualiza sozinha.
  const jogos = useBibliotecaStore((s) => s.jogos);
  const carregandoBiblioteca = useBibliotecaStore((s) => s.carregando);
  const erroBiblioteca = useBibliotecaStore((s) => s.erro);
  const recarregarBiblioteca = useBibliotecaStore((s) => s.carregar);

  const [nome, setNome] = useState(NOME_PADRAO);
  const [estatisticas, setEstatisticas] =
    useState<Estatisticas>(ESTATISTICAS_ZERADAS);
  const [populares, setPopulares] = useState<Jogo[]>([]);
  // Só a PRIMEIRA leitura mostra "carregando". Nas próximas (voltar para a aba,
  // registrar horas), os números antigos ficam na tela até os novos chegarem.
  const [perfilPronto, setPerfilPronto] = useState(false);
  const [estatisticasProntas, setEstatisticasProntas] = useState(false);
  const [carregandoPopulares, setCarregandoPopulares] = useState(false);

  const estadoBiblioteca = estadoDaBiblioteca(
    carregandoBiblioteca,
    erroBiblioteca,
    jogos.length,
  );
  const bibliotecaVazia = estadoBiblioteca === "VAZIA";

  // Nome: relê quando a aba ganha foco (pode ter mudado em Configurações).
  useFocusEffect(
    useCallback(() => {
      let ativo = true;
      obterUsuario()
        .then((usuario) => {
          if (ativo) setNome(usuario?.nome || NOME_PADRAO);
        })
        .catch((e) => console.warn("Erro ao ler o usuário:", e))
        .finally(() => {
          if (ativo) setPerfilPronto(true);
        });
      return () => {
        ativo = false;
      };
    }, []),
  );

  // Estatísticas (SQL): recalcula toda vez que a lista de jogos muda.
  useEffect(() => {
    let ativo = true;
    obterEstatisticas()
      .then((dados) => {
        if (ativo) setEstatisticas(dados);
      })
      .catch((e) => console.warn("Erro ao calcular estatísticas:", e))
      .finally(() => {
        if (ativo) setEstatisticasProntas(true);
      });
    return () => {
      ativo = false;
    };
  }, [jogos]);

  // Populares da RAWG: só com a biblioteca vazia, e uma vez só. São opcionais:
  // sem internet a seção some e a Home continua funcionando.
  useEffect(() => {
    if (!bibliotecaVazia || populares.length > 0) {
      setCarregandoPopulares(false);
      return;
    }

    const controller = new AbortController();
    let ativo = true;
    setCarregandoPopulares(true);

    buscarJogosPopulares(10, { signal: controller.signal })
      .then((lista) => {
        if (ativo) setPopulares(lista);
      })
      .catch((e) => {
        if (ativo) console.warn("Sem populares da RAWG:", e);
      })
      .finally(() => {
        if (ativo) setCarregandoPopulares(false);
      });

    return () => {
      ativo = false;
      controller.abort(); // saiu da tela: cancela a busca
    };
  }, [bibliotecaVazia, populares.length]);

  // Carrossel: todos os "Jogando", do mais recente para o mais antigo.
  const jogando = useMemo(() => porStatus(jogos, "JOGANDO"), [jogos]);
  // Recentes: os que NÃO estão no carrossel, para não repetir.
  const jogadosRecentemente = useMemo(
    () =>
      recentes(
        jogos.filter((j) => j.status !== "JOGANDO"),
        QUANTIDADE_RECENTES,
      ),
    [jogos],
  );

  return {
    nome,
    bibliotecaVazia,
    estadoBiblioteca,
    carregandoDados: !perfilPronto || !estatisticasProntas,
    carregandoPopulares,
    erroBiblioteca,
    tentarNovamente: () => void recarregarBiblioteca(),
    resumo: {
      zerados: estatisticas.totalConcluidos,
      emAndamento: estatisticas.quantidadePorStatus.JOGANDO ?? 0,
      naFila: estatisticas.quantidadePorStatus.NA_FILA ?? 0,
      horas: estatisticas.horasTotais,
    },
    jogando,
    jogadosRecentemente,
    populares,
  };
}
