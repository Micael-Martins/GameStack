import { useState } from "react";

import { reagendarLembrete } from "../../../data/services/notificacaoService";
import { useBibliotecaStore } from "../../../store/bibliotecaStore";
import {
  desfazer,
  iniciarProgresso,
  percentualDoTempoMedio,
  type Progresso,
  somar,
  substituirTotal,
  textoSessao,
  totalDigitadoEmMinutos,
} from "../Model/registroHoras";

// Toda a lógica da tela Registrar horas (tela 08). A View só mostra o que este hook devolve.
// Guarda os minutos iniciais, os atuais e o histórico das mudanças (para o "Desfazer").
export function useRegistrarHorasViewModel(id: string) {
  const item = useBibliotecaStore((s) =>
    s.jogos.find((jogo) => jogo.id === id),
  );
  const atualizar = useBibliotecaStore((s) => s.atualizar);
  const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);

  // Os minutos iniciais ficam fixos enquanto a tela está aberta.
  const [minutosIniciais] = useState(() => item?.minutosJogados ?? 0);
  const [progresso, setProgresso] = useState<Progresso>(() =>
    iniciarProgresso(minutosIniciais),
  );
  const [totalDigitado, setTotalDigitado] = useState("");
  const [erroTotal, setErroTotal] = useState<string | null>(null);
  const [anotacao, setAnotacao] = useState(item?.anotacao ?? "");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function somarMinutos(minutos: number) {
    setProgresso((atual) => somar(atual, minutos));
    setTotalDigitado(""); // o total digitado deixa de valer depois de somar
    setErroTotal(null);
  }

  function alterarTotalDigitado(texto: string) {
    setTotalDigitado(texto);
    setErroTotal(null);
  }

  // Aplica o total do campo (ao sair do campo, apertar Enter ou salvar).
  // Devolve false se o texto for inválido.
  function aplicarTotalDigitado(): boolean {
    if (totalDigitado.trim() === "") return true;
    const minutos = totalDigitadoEmMinutos(totalDigitado);
    if (minutos === null) {
      setErroTotal("Digite o total em horas, como 44 ou 44,5.");
      return false;
    }
    setProgresso((atual) => substituirTotal(atual, minutos));
    setTotalDigitado("");
    return true;
  }

  function desfazerUltima() {
    setProgresso((atual) => desfazer(atual));
    setErroTotal(null);
  }

  // "Salvar progresso": grava minutos e anotação; se o jogo estava Na fila, passa para Jogando.
  // Devolve true quando salvou (a tela então volta).
  async function salvar(): Promise<boolean> {
    if (!item || salvando) return false;

    // Se ainda tem um total digitado e não aplicado, ele vale.
    let minutos = progresso.minutos;
    if (totalDigitado.trim() !== "") {
      const digitado = totalDigitadoEmMinutos(totalDigitado);
      if (digitado === null) {
        setErroTotal("Digite o total em horas, como 44 ou 44,5.");
        return false;
      }
      minutos = digitado;
    }

    setSalvando(true);
    setErro(null);
    try {
      const campos: { minutosJogados?: number; anotacao?: string } = {};
      if (minutos !== item.minutosJogados) campos.minutosJogados = minutos;
      if (anotacao.trim() !== item.anotacao.trim()) campos.anotacao = anotacao;
      if (campos.minutosJogados !== undefined || campos.anotacao !== undefined)
        await atualizar(item.id, campos);
      if (item.status === "NA_FILA") await mudarStatus(item.id, "JOGANDO");
    } catch (e) {
      console.warn("Erro ao salvar o progresso.", e);
      setErro("Não foi possível salvar o progresso. Tente de novo.");
      return false;
    } finally {
      setSalvando(false);
    }

    // Registrou: o lembrete dos 5 dias volta a contar a partir de agora.
    reagendarLembrete().catch((e) =>
      console.warn("Erro ao reagendar o lembrete.", e),
    );
    return true;
  }

  const tempoMedio = item?.jogo.tempoMedio ?? 0;
  const percentual = percentualDoTempoMedio(progresso.minutos, tempoMedio);

  return {
    item,
    minutos: progresso.minutos,
    textoSessao: textoSessao(minutosIniciais, progresso.minutos),
    progressoBarra: percentual === null ? 0 : Math.min(1, percentual / 100),
    percentual,
    tempoMedio,
    somarMinutos,
    podeDesfazer: progresso.historico.length > 0,
    desfazerUltima,
    totalDigitado,
    alterarTotalDigitado,
    aplicarTotalDigitado,
    erroTotal,
    anotacao,
    setAnotacao,
    salvando,
    erro,
    salvar,
    vaiComecar: item?.status === "NA_FILA", // aviso de que vai virar Jogando
  };
}
