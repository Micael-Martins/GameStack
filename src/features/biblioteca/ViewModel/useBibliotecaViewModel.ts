import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import { CHAVES, ler, salvar } from '../../../data/storage/preferencias';
import type { StatusJogo } from '../../../models/StatusJogo';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import { contarPorStatus, filtrarBiblioteca, type FiltroBiblioteca } from '../Model/filtrosBiblioteca';

const FILTROS_VALIDOS: FiltroBiblioteca[] = ['TODOS', 'JOGANDO', 'NA_FILA', 'CONCLUIDO', 'ABANDONADO'];

function filtroSalvoValido(valor: string): valor is FiltroBiblioteca {
  return FILTROS_VALIDOS.includes(valor as FiltroBiblioteca);
}

export function useBibliotecaViewModel() {
  const jogos = useBibliotecaStore((estado) => estado.jogos);
  const carregando = useBibliotecaStore((estado) => estado.carregando);
  const erro = useBibliotecaStore((estado) => estado.erro);
  const carregar = useBibliotecaStore((estado) => estado.carregar);
  const [filtro, setFiltro] = useState<FiltroBiblioteca>('TODOS');
  const [termo, setTermo] = useState('');

  useEffect(() => {
    let ativo = true;
    ler(CHAVES.ultimoFiltro).then((salvo) => {
      if (ativo && filtroSalvoValido(salvo)) setFiltro(salvo);
    });
    return () => { ativo = false; };
  }, []);

  // Recarrega ao voltar para a aba, mantendo a lista sincronizada com o SQLite.
  useFocusEffect(useCallback(() => {
    void carregar();
  }, [carregar]));

  const selecionarFiltro = useCallback((novoFiltro: FiltroBiblioteca) => {
    setFiltro(novoFiltro);
    void salvar(CHAVES.ultimoFiltro, novoFiltro);
  }, []);

  const jogosVisiveis = useMemo(
    () => filtrarBiblioteca(jogos, filtro, termo),
    [jogos, filtro, termo],
  );

  const contagens = useMemo(() => ({
    TODOS: jogos.length,
    JOGANDO: contarPorStatus(jogos, 'JOGANDO'),
    NA_FILA: contarPorStatus(jogos, 'NA_FILA'),
    CONCLUIDO: contarPorStatus(jogos, 'CONCLUIDO'),
    ABANDONADO: contarPorStatus(jogos, 'ABANDONADO'),
  }), [jogos]);

  return {
    jogos,
    jogosVisiveis,
    carregando,
    erro,
    filtro,
    termo,
    contagens,
    setTermo,
    selecionarFiltro,
    tentarNovamente: carregar,
    quantidadePorStatus: (status: StatusJogo) => contagens[status],
  };
}
