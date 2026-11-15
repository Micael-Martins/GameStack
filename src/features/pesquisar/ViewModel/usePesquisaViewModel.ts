import { useCallback, useEffect, useRef, useState } from 'react';

import { buscarJogosRawg } from '../../../data/services/rawgService';
import {
  CHAVES,
  adicionarPesquisaRecente,
  ler,
  limparPesquisasRecentes,
} from '../../../data/storage/preferencias';

import {
  criarPesquisaController,
  ESTADO_INICIAL_PESQUISA,
  type EstadoPesquisa,
} from './pesquisaController';

export function usePesquisaViewModel() {
  const [termoDigitado, setTermoDigitado] = useState('');
  const [estado, setEstado] = useState<EstadoPesquisa>(
    ESTADO_INICIAL_PESQUISA,
  );
  const [pesquisasRecentes, setPesquisasRecentes] = useState<string[]>([]);

  const montado = useRef(true);

  // A mesma instância controla todas as buscas durante a vida da tela.
  const [controller] = useState(() =>
    criarPesquisaController(buscarJogosRawg, setEstado),
  );

  useEffect(() => {
    montado.current = true;

    // Recupera o histórico que já existe no AsyncStorage.
    ler(CHAVES.pesquisasRecentes).then((recentes) => {
      if (montado.current) {
        setPesquisasRecentes(recentes);
      }
    });

    return () => {
      montado.current = false;
      controller.interromper();
    };
  }, [controller]);

  const pesquisar = useCallback(
    async (texto: string = termoDigitado): Promise<void> => {
      setTermoDigitado(texto);

      const sucesso = await controller.pesquisar(texto);

      if (!sucesso || !montado.current) {
        return;
      }

      // O helper existente já remove repetidos e limita a 5 pesquisas.
      await adicionarPesquisaRecente(texto);

      const recentes = await ler(CHAVES.pesquisasRecentes);

      if (montado.current) {
        setPesquisasRecentes(recentes);
      }
    },
    [controller, termoDigitado],
  );

  const carregarMais = useCallback(async (): Promise<void> => {
    await controller.carregarMais();
  }, [controller]);

  const limparPesquisa = useCallback(() => {
    controller.limpar();
    setTermoDigitado('');
  }, [controller]);

  const limparHistorico = useCallback(async () => {
    await limparPesquisasRecentes();

    if (montado.current) {
      setPesquisasRecentes([]);
    }
  }, []);

  return {
    termoDigitado,
    setTermoDigitado,

    // Resultados e estados para a interface.
    ...estado,

    pesquisasRecentes,

    // Ações disponíveis para a interface.
    pesquisar,
    selecionarPesquisaRecente: pesquisar,
    carregarMais,
    cancelarPesquisa: controller.cancelar,
    limparPesquisa,
    limparHistorico,
  };
}
