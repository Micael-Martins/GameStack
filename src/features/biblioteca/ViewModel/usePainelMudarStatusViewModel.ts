import { useEffect, useState } from 'react';

import { reagendarLembrete } from '../../../data/services/notificationService';
import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { StatusJogo } from '../../../models/StatusJogo';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import { acaoDaOpcao } from '../Model/opcoesPainelStatus';

export function usePainelMudarStatusViewModel(
  item: JogoBiblioteca | null,
  visivel: boolean,
  onFechar: () => void,
  onConcluir: (item: JogoBiblioteca) => void,
) {
  const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);

  // Prioriza a versão atualizada que estiver na store.
  const jogoNaStore = useBibliotecaStore((s) => s.jogos.find((jogo) => jogo.id === item?.id));
  const jogoAtual = jogoNaStore ?? item;

  // Qual opção está salvando agora (mostra o carregando só nela).
  const [salvandoStatus, setSalvandoStatus] = useState<StatusJogo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Cada abertura começa sem erro.
  useEffect(() => {
    if (visivel) setErro(null);
  }, [visivel]);

  const salvando = salvandoStatus !== null;

  async function escolher(status: StatusJogo): Promise<void> {
    if (!jogoAtual || salvando) return;

    const acao = acaoDaOpcao(jogoAtual.status, status);

    if (acao === 'nada') return;

    // Concluir sempre passa pela tela de conclusão, que pede a nota.
    if (acao === 'concluir') {
      onFechar();
      onConcluir(jogoAtual);
      return;
    }

    setSalvandoStatus(status);
    setErro(null);

    try {
      await mudarStatus(jogoAtual.id, status);
    } catch (e) {
      console.warn('Erro ao mudar o status do jogo.', e);
      setErro('Não foi possível mudar o status. Tente novamente.');
      return;
    } finally {
      setSalvandoStatus(null);
    }

    // Mexeu no jogo: o lembrete dos 5 dias volta a contar a partir de agora.
    reagendarLembrete().catch((e) => console.warn('Erro ao reagendar o lembrete.', e));

    onFechar();
  }

  return {
    jogoAtual,
    escolher,
    salvando,
    salvandoStatus,
    erro,
  };
}