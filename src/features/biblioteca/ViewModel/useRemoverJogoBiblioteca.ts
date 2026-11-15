import { useRef, useState } from 'react';

import { reagendarLembrete } from '../../../data/services/notificationService';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import { executarRemocaoJogo } from '../Model/remocaoJogo';

export function useRemoverJogoBiblioteca(
  jogoId: string,
  onRemovido: () => void,
) {
  const remover = useBibliotecaStore((s) => s.remover);
  const emExecucao = useRef(false);

  const [removendo, setRemovendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function removerConfirmado(): Promise<boolean> {
    if (emExecucao.current) return false;

    emExecucao.current = true;
    setRemovendo(true);
    setErro(null);

    let sucesso = false;

    try {
      await executarRemocaoJogo(jogoId, {
        remover,
        reagendarLembrete,
      });

      sucesso = true;
    } catch (e) {
      console.warn('Erro ao remover jogo da biblioteca.', e);
      setErro('Não foi possível remover o jogo. Tente novamente.');
    } finally {
      emExecucao.current = false;
      setRemovendo(false);
    }

    if (sucesso) {
      onRemovido();
    }

    return sucesso;
  }

  return {
    removendo,
    erro,
    removerConfirmado,
  };
}
