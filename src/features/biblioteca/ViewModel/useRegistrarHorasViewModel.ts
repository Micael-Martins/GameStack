import { useRef, useState } from 'react';

import { reagendarLembrete } from '../../../data/services/notificationService';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';
import { calcularTotalMinutos, converterHorasParaMinutos } from '../Model/registroHoras';

export function useRegistrarHorasViewModel(jogoId: string) {
  const item = useBibliotecaStore((estado) => estado.jogos.find((jogo) => jogo.id === jogoId));
  const atualizar = useBibliotecaStore((estado) => estado.atualizar);
  const [horas, setHoras] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const emExecucao = useRef(false);

  async function salvar(): Promise<boolean> {
    if (emExecucao.current || !item) return false;

    const minutosAdicionados = converterHorasParaMinutos(horas);
    if (minutosAdicionados === null) {
      setErro('Digite um tempo maior que zero, como 1 ou 1,5.');
      return false;
    }

    emExecucao.current = true;
    setSalvando(true);
    setErro(null);
    try {
      // O banco guarda o acumulado; a entrada desta tela representa só a nova sessão.
      const totalMinutos = calcularTotalMinutos(item.minutosJogados, minutosAdicionados);
      await atualizar(item.id, { minutosJogados: totalMinutos });
      reagendarLembrete().catch((error) => console.warn('Erro ao reagendar o lembrete.', error));
      return true;
    } catch (error) {
      console.warn('Erro ao registrar horas.', error);
      setErro('Não foi possível registrar as horas. Tente novamente.');
      return false;
    } finally {
      emExecucao.current = false;
      setSalvando(false);
    }
  }

  return { item, horas, setHoras, erro, salvando, salvar };
}
