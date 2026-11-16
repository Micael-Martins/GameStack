import { useMemo, useState } from "react";

import { useBibliotecaStore } from "../../../store/bibliotecaStore";
import {
  linhaConclusao,
  numeroDoZerado,
  proximoDaFila,
  textoNota,
} from "../Model/conclusao";

// Toda a lógica da tela Concluir jogo (tela 10). A View só mostra o que este hook devolve.
export function useConcluirViewModel(id: string) {
  const jogos = useBibliotecaStore((s) => s.jogos);
  const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);
  const atualizar = useBibliotecaStore((s) => s.atualizar);

  const item = jogos.find((jogo) => jogo.id === id);

  const [nota, setNota] = useState<number | null>(item?.nota ?? null);
  // Começa com a anotação que o jogo já tinha, para não perder nada.
  const [anotacao, setAnotacao] = useState(item?.anotacao ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // O próximo da fila é calculado uma vez ao abrir: depois de tocar em "Começar"
  // ele vira Jogando, mas o card continua na tela mostrando que começou.
  const [proximo] = useState(() => proximoDaFila(jogos, id));
  const [comecouProximo, setComecouProximo] = useState(false);
  const [comecando, setComecando] = useState(false);

  // Número calculado ao abrir (depois de salvar, este jogo já conta como concluído).
  const [numero] = useState(() => numeroDoZerado(jogos, id));
  const resumo = useMemo(
    () => (item ? linhaConclusao(item.minutosJogados, numero) : ""),
    [item, numero],
  );

  function escolherNota(valor: number) {
    setNota(valor);
    setErro(null);
  }

  // "Começar": o próximo da fila passa para Jogando na hora.
  async function comecarProximo(): Promise<void> {
    if (!proximo || comecando || comecouProximo) return;
    setComecando(true);
    try {
      await mudarStatus(proximo.id, "JOGANDO");
      setComecouProximo(true);
    } catch (e) {
      console.warn("Erro ao começar o próximo jogo.", e);
      setErro("Não foi possível começar o próximo jogo. Tente de novo.");
    } finally {
      setComecando(false);
    }
  }

  // "Salvar e concluir": as regras de status gravam CONCLUIDO, a nota e a data de conclusão.
  // Devolve true quando salvou (a tela então vai para a Biblioteca).
  async function concluir(): Promise<boolean> {
    if (!item || salvando) return false;
    if (nota === null) {
      setErro("Escolha uma nota para concluir.");
      return false;
    }

    setSalvando(true);
    setErro(null);
    try {
      if (anotacao.trim() !== item.anotacao.trim())
        await atualizar(item.id, { anotacao });
      await mudarStatus(item.id, "CONCLUIDO", nota);
    } catch (e) {
      console.warn("Erro ao concluir o jogo.", e);
      setErro("Não foi possível concluir o jogo. Tente de novo.");
      return false;
    } finally {
      setSalvando(false);
    }

    return true;
  }

  return {
    item,
    resumo,
    nota,
    textoNota: textoNota(nota),
    escolherNota,
    anotacao,
    setAnotacao,
    proximo,
    comecouProximo,
    comecando,
    comecarProximo,
    salvando,
    erro,
    concluir,
  };
}
