import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { salvarPerfil } from '../../../data/db/userRepository';
import { buscarCapasPopulares } from '../../../data/services/rawgService';
import { pedirPermissao, reagendarLembrete } from '../../../data/services/notificationService';
import { CHAVES, salvar } from '../../../data/storage/preferencias';

const NOME_PADRAO = 'Jogador';
const ESPERA_MAXIMA_CAPAS = 2500; // ms: sem internet, a animação começa assim mesmo

// Toda a lógica da tela de boas-vindas. A View só mostra o que este hook devolve.
// aoTerminar: o que fazer depois de salvar (ir para as abas).
export function useBoasVindasViewModel(aoTerminar: () => void) {
  const [nome, setNome] = useState('');
  const [lembretesAtivos, setLembretesAtivos] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [capas, setCapas] = useState<string[]>([]);
  const [capasProntas, setCapasProntas] = useState(false);

  // Busca as capas e baixa as imagens antes de liberar a animação.
  useEffect(() => {
    let terminou = false;
    const liberar = () => {
      if (!terminou) {
        terminou = true;
        setCapasProntas(true);
      }
    };
    const limite = setTimeout(liberar, ESPERA_MAXIMA_CAPAS);

    buscarCapasPopulares(3)
      .then(async (urls) => {
        await Promise.all(urls.map((url) => Image.prefetch(url).catch(() => false)));
        setCapas(urls);
      })
      .catch((e) => console.warn('Sem capas da RAWG:', e))
      .finally(() => {
        clearTimeout(limite);
        liberar();
      });

    return () => clearTimeout(limite);
  }, []);

  // Botão "Começar"
  async function comecar() {
    setSalvando(true);
    setErro(null);
    try {
      // Lembretes ligados: o celular mostra o alerta "Permitir notificações?".
      // Se a pessoa negar, salvamos como desligado (dá para ligar depois em Configurações).
      let lembretes = lembretesAtivos;
      if (lembretes) {
        lembretes = await pedirPermissao();
      }

      await salvarPerfil(nome.trim() || NOME_PADRAO, lembretes);
      await salvar(CHAVES.onboardingVisto, true);
      await reagendarLembrete(); // agenda o lembrete se tiver permissão e jogo "Jogando"
      aoTerminar();
    } catch (e) {
      setErro('Não foi possível salvar. Tente de novo.');
    } finally {
      setSalvando(false);
    }
  }

  return { nome, setNome, lembretesAtivos, setLembretesAtivos, salvando, erro, comecar, capas, capasProntas };
}
