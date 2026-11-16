import { useRef, useState } from "react";

import { useBibliotecaStore } from "../../../store/bibliotecaStore";

// Lógica do botão de remover (lixeira da tela Detalhes).
export function useBotaoRemoverViewModel(
  jogoId: string,
  onRemovido: () => void,
) {
  const remover = useBibliotecaStore((s) => s.remover);
  const emExecucao = useRef(false); // evita remover duas vezes com toques rápidos

  const [removendo, setRemovendo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function removerConfirmado(): Promise<boolean> {
    if (emExecucao.current) return false;

    emExecucao.current = true;
    setRemovendo(true);
    setErro(null);

    let sucesso = false;

    try {
      // Remove da store e do banco (a store já reagenda o lembrete dos 5 dias)
      await remover(jogoId);

      sucesso = true;
    } catch (e) {
      console.warn("Erro ao remover jogo da biblioteca.", e);
      setErro("Não foi possível remover o jogo. Tente novamente.");
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
