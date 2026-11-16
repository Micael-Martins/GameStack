import { useEffect, useMemo, useState } from 'react';

import { CHAVES, ler, salvar } from '../../../data/storage/preferencias';
import { estadoDaBiblioteca, useBibliotecaStore } from '../../../store/bibliotecaStore';
import {
  contagemPorFiltro,
  type FiltroBiblioteca,
  filtrarJogos,
  filtroValido,
  textoResumo,
} from '../Model/filtrosBiblioteca';

// Toda a lógica da tela Biblioteca. A View só mostra o que este hook devolve.
// filtroInicial: quando outra tela abre a Biblioteca já filtrada (ex.: "Ver minha fila" na Home).
export function useBibliotecaViewModel(filtroInicial?: FiltroBiblioteca) {
  // Jogos da store, já ordenados pela última sessão.
  const jogos = useBibliotecaStore((s) => s.jogos);
const carregando = useBibliotecaStore((s) => s.carregando);
  const erro = useBibliotecaStore((s) => s.erro);
  const carregar = useBibliotecaStore((s) => s.carregar);
  const [filtro, setFiltro] = useState<FiltroBiblioteca>('TODOS');

  // Ao abrir (só uma vez): usa o último filtro salvo no AsyncStorage.
  useEffect(() => {
    if (filtroInicial) return; // quem abriu a tela já escolheu o filtro
    ler(CHAVES.ultimoFiltro)
      .then((salvo) => setFiltro(filtroValido(salvo)))
      .catch((e) => console.warn('Erro ao ler o último filtro:', e));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Veio de outra tela com um filtro: troca para ele (e salva, como se a pessoa tivesse tocado).
  useEffect(() => {
    if (filtroInicial) trocarFiltro(filtroInicial);
  }, [filtroInicial]);

  function trocarFiltro(novo: FiltroBiblioteca) {
    setFiltro(novo);
    salvar(CHAVES.ultimoFiltro, novo).catch((e) => console.warn('Erro ao salvar o filtro:', e));
  }

  const jogosFiltrados = useMemo(() => filtrarJogos(jogos, filtro), [jogos, filtro]);
  const contagem = useMemo(() => contagemPorFiltro(jogos), [jogos]);

  return {
    filtro,
    trocarFiltro,
    jogosFiltrados,
    contagem,
    resumo: textoResumo(jogos),
    total: jogos.length,
    estado: estadoDaBiblioteca(carregando, erro, jogos.length),
    erro,
    tentarNovamente: () => void carregar(), // lê os jogos do SQLite de novo
  };
};
