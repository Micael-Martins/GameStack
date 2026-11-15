import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buscarJogosRawg } from '../../../data/services/rawgService';
import {
  CHAVES,
  adicionarPesquisaRecente,
  ler,
  limparPesquisasRecentes,
} from '../../../data/storage/preferencias';
import type { Jogo } from '../../../models/Jogo';
import { useBibliotecaStore } from '../../../store/bibliotecaStore';

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

   // Jogos que já estão na biblioteca (pela store, então atualiza na hora ao adicionar).
   // Cada resultado sabe se já está na biblioteca (botão "Adicionar" × "Na biblioteca").
    // Jogos que já estão na biblioteca (pela store, então atualiza na hora ao adicionar).
  // Guarda o id da biblioteca de cada um, para o card abrir os Detalhes.
  const jogosNaBiblioteca = useBibliotecaStore((s) => s.jogos);
  const idsNaBiblioteca = useMemo(
    () => new Map(jogosNaBiblioteca.map((item) => [item.jogo.apiId, item.id])),
    [jogosNaBiblioteca],
  );

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

  const tentarNovamente = useCallback(async (): Promise<void> => {
    await controller.tentarNovamente();
  }, [controller]);

  // Cada resultado sabe se já está na biblioteca (botão "Adicionar" × "Na biblioteca").
    // Cada resultado sabe se já está na biblioteca ("+" × "Na biblioteca") e, se estiver, o id dele lá.
  const resultados = useMemo(
    () =>
      estado.jogos.map((jogo: Jogo) => {
        const idBiblioteca = idsNaBiblioteca.get(jogo.apiId) ?? null;
        return { jogo, naBiblioteca: idBiblioteca !== null, idBiblioteca };
      }),
    [estado.jogos, idsNaBiblioteca],
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
    resultados,

    pesquisasRecentes,

    pesquisar,
    selecionarPesquisaRecente: pesquisar,
    carregarMais,
    tentarNovamente,
    cancelarPesquisa: controller.cancelar,
    limparPesquisa,
    limparHistorico,
  };
}