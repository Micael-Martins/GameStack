import { useEffect, useState } from 'react';

import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { StatusJogo } from '../../../models/StatusJogo';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import {
  notaParaMudanca,
  podeSalvarStatus,
} from '../Model/opcoesPainelStatus';

export function usePainelMudarStatusViewModel(
  item: JogoBiblioteca | null,
  visivel: boolean,
  onFechar: () => void,
  onSalvo?: () => void,
) {
  const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);

  // Prioriza a versão atualizada que estiver na store.
  const jogoNaStore = useBibliotecaStore((s) =>
    s.jogos.find((jogo) => jogo.id === item?.id),
  );
  const jogoAtual = jogoNaStore ?? item;

  const [statusSelecionado, setStatusSelecionado] =
    useState<StatusJogo>(item?.status ?? 'NA_FILA');

  const [notaSelecionada, setNotaSelecionada] =
    useState<number | null>(item?.nota ?? null);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Cada abertura começa com os dados atuais do jogo.
  useEffect(() => {
    if (!visivel || !jogoAtual) return;

    setStatusSelecionado(jogoAtual.status);
    setNotaSelecionada(jogoAtual.nota);
    setErro(null);
  }, [
    visivel,
    jogoAtual?.id,
    jogoAtual?.status,
    jogoAtual?.nota,
  ]);

  const podeConfirmar =
    !!jogoAtual &&
    !salvando &&
    podeSalvarStatus(jogoAtual.status, statusSelecionado);

  function selecionarStatus(status: StatusJogo) {
    if (salvando) return;

    setStatusSelecionado(status);
    setErro(null);
  }

  function selecionarNota(nota: number) {
    if (salvando) return;

    setNotaSelecionada(nota);
    setErro(null);
  }

  async function confirmar(): Promise<void> {
    if (!jogoAtual || !podeConfirmar) return;

    setSalvando(true);
    setErro(null);

    try {
      await mudarStatus(
        jogoAtual.id,
        statusSelecionado,
        notaParaMudanca(statusSelecionado, notaSelecionada),
      );
    } catch (e) {
      console.warn('Erro ao mudar o status do jogo.', e);
      setErro('Não foi possível salvar o status. Tente novamente.');
      return;
    } finally {
      setSalvando(false);
    }

    onSalvo?.();
    onFechar();
  }

  return {
    jogoAtual,
    statusSelecionado,
    notaSelecionada,
    selecionarStatus,
    selecionarNota,
    podeConfirmar,
    confirmar,
    salvando,
    erro,
  };
}
