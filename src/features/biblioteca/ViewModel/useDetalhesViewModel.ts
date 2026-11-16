import { useEffect, useState } from "react";

import { useBibliotecaStore } from "../../../store/bibliotecaStore";
import {
    anotacaoMudou,
    fraseStatus,
    linhasInformacoes,
} from "../Model/detalhesJogo";

// Toda a lógica da tela Detalhes do jogo. A View só mostra o que este hook devolve.
// Recebe só o id: o jogo vem da store, então a tela se atualiza sozinha
// quando o status muda no painel ou quando as horas são registradas.
export function useDetalhesViewModel(id: string) {
  const item = useBibliotecaStore((s) =>
    s.jogos.find((jogo) => jogo.id === id),
  );
  const atualizar = useBibliotecaStore((s) => s.atualizar);

  const [anotacao, setAnotacao] = useState(item?.anotacao ?? "");
  const [painelAberto, setPainelAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Se a anotação mudar fora daqui (ex.: apagar todos os dados), acompanha.
  useEffect(() => {
    setAnotacao(item?.anotacao ?? "");
  }, [item?.anotacao]);

  // Devolve true quando terminou (a tela então volta).
  async function salvar(): Promise<boolean> {
    if (!item || salvando) return false;
    if (!anotacaoMudou(item.anotacao, anotacao)) return true; // nada mudou: só volta

    setSalvando(true);
    setErro(null);
    try {
      await atualizar(item.id, { anotacao });
    } catch (e) {
      console.warn("Erro ao salvar a anotação.", e);
      setErro("Não foi possível salvar a anotação. Tente novamente.");
      return false;
    } finally {
      setSalvando(false);
    }

    return true;
  }

  return {
    item, // undefined depois que o jogo é removido
    fraseStatus: item ? fraseStatus(item) : "",
    informacoes: item ? linhasInformacoes(item) : [],
    anotacao,
    setAnotacao,
    painelAberto,
    abrirPainel: () => setPainelAberto(true),
    fecharPainel: () => setPainelAberto(false),
    salvar,
    salvando,
    erro,
  };
}
