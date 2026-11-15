import { useEffect, useState } from 'react';

import { buscarDetalhes, type SobreJogo } from '../../../data/services/rawgService';
import { reagendarLembrete } from '../../../data/services/notificationService';
import type { Jogo } from '../../../models/Jogo';
import type { StatusJogo } from '../../../models/StatusJogo';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import { minutosIniciais, mostraCampoHoras, STATUS_INICIAL_PADRAO } from '../Model/adicionarJogo';

// Toda a lógica da tela Adicionar jogo (tela 05). A View só mostra o que este hook devolve.
export function useAdicionarViewModel(jogoInicial: Jogo) {
  const adicionarNaStore = useBibliotecaStore((s) => s.adicionar);

  const [jogo, setJogo] = useState<Jogo>(jogoInicial);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(true);
  const [sobre, setSobre] = useState<SobreJogo | null>(null); // seção "Sobre o jogo"
  const [status, setStatus] = useState<StatusJogo>(STATUS_INICIAL_PADRAO);
  const [horas, setHoras] = useState('');
  const [erroHoras, setErroHoras] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Ao abrir, busca a desenvolvedora e o "Sobre o jogo".
  // Se falhar, mostra sem eles e salva assim mesmo.
  useEffect(() => {
    let ativo = true;
    buscarDetalhes(jogoInicial.apiId)
      .then((detalhes) => {
        if (!ativo) return;
        if (detalhes.desenvolvedora) {
          setJogo((atual) => ({ ...atual, desenvolvedora: detalhes.desenvolvedora }));
        }
        setSobre(detalhes.sobre);
      })
      .catch((e) => console.warn('Sem detalhes da RAWG:', e))
      .finally(() => {
        if (ativo) setCarregandoDetalhes(false);
      });
    return () => {
      ativo = false; // a tela fechou antes da resposta chegar
    };
  }, [jogoInicial.apiId]);

  function alterarHoras(texto: string) {
    setHoras(texto);
    setErroHoras(null);
  }

  // Devolve true quando salvou (a tela então vai para a Biblioteca).
  async function adicionar(): Promise<boolean> {
    if (salvando) return false;

    const minutos = minutosIniciais(status, horas);
    if (minutos === null) {
      setErroHoras('Digite um número de horas válido, como 12 ou 12,5.');
      return false;
    }

    setSalvando(true);
    setErro(null);
    try {
      await adicionarNaStore(jogo, status, minutos);
    } catch (e) {
      console.warn('Erro ao adicionar o jogo.', e);
      setErro(e instanceof Error ? e.message : 'Não foi possível adicionar o jogo.');
      return false;
    } finally {
      setSalvando(false);
    }

    // Um jogo novo em Jogando muda o lembrete dos 5 dias.
    reagendarLembrete().catch((e) => console.warn('Erro ao reagendar o lembrete.', e));
    return true;
  }

  return {
    jogo,
    carregandoDetalhes,
    sobre,
    status,
    setStatus,
    horas,
    alterarHoras,
    erroHoras,
    mostrarCampoHoras: mostraCampoHoras(status),
    salvando,
    erro,
    adicionar,
  };
}