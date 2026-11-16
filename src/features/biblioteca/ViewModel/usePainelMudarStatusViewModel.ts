import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import type { JogoBiblioteca } from "../../../models/JogoBiblioteca";
import type { StatusJogo } from "../../../models/StatusJogo";
import { useBibliotecaStore } from "../../../store/bibliotecaStore";
import { acaoDaOpcao } from "../Model/opcoesPainelStatus";

export function usePainelMudarStatusViewModel(
  item: JogoBiblioteca | null,
  visivel: boolean,
  onFechar: () => void,
  onConcluir: (item: JogoBiblioteca) => void,
) {
  const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);

  // Prioriza a versão atualizada que estiver na store.
  const jogoNaStore = useBibliotecaStore((s) =>
    s.jogos.find((jogo) => jogo.id === item?.id),
  );
  const jogoAtual = jogoNaStore ?? item;

  // Qual opção está salvando agora (mostra o carregando só nela).
  const [salvandoStatus, setSalvandoStatus] = useState<StatusJogo | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  // Cada abertura começa sem erro.
  useEffect(() => {
    if (visivel) setErro(null);
  }, [visivel]);

  const salvando = salvandoStatus !== null;

  // No iPhone, abrir a tela Concluir enquanto o painel (Modal) ainda está fechando
  // pode falhar: o iOS ignora uma tela nova por cima de outra que está saindo.
  // Por isso o jogo fica guardado aqui e a navegação só acontece quando o painel
  // terminar de fechar (onDismiss do Modal, ver aoTerminarDeFechar).
  const concluirPendente = useRef<JogoBiblioteca | null>(null);

  function aoTerminarDeFechar() {
    const jogo = concluirPendente.current;
    concluirPendente.current = null;
    if (jogo) onConcluir(jogo);
  }

  async function escolher(status: StatusJogo): Promise<void> {
    if (!jogoAtual || salvando) return;

    const acao = acaoDaOpcao(jogoAtual.status, status);

    if (acao === "nada") return;

    if (acao === "concluir") {
      if (Platform.OS === "ios") {
        concluirPendente.current = jogoAtual; // abre quando o painel terminar de fechar
        onFechar();
      } else {
        onFechar(); // no Android não tem esse problema
        onConcluir(jogoAtual);
      }
      return;
    }

    setSalvandoStatus(status);
    setErro(null);

    try {
      await mudarStatus(jogoAtual.id, status);
    } catch (e) {
      console.warn("Erro ao mudar o status do jogo.", e);
      setErro("Não foi possível mudar o status. Tente novamente.");
      return;
    } finally {
      setSalvandoStatus(null);
    }


    onFechar();
  }

  return {
    jogoAtual,
    escolher,
    salvando,
    salvandoStatus,
    erro,
    aoTerminarDeFechar,
  };
}
