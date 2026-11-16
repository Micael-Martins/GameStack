import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';

import { atualizarLembrete, configurarNotificacoes } from '../data/services/notificacaoService';
import { CHAVES, ler } from '../data/storage/preferencias';
import type { RootStackParamList } from '../navigation/tipos';
import { carregarBiblioteca } from '../store/bibliotecaStore';

// A splash (tela de abertura) fica na frente até o app estar pronto.
SplashScreen.preventAutoHideAsync();

// Tudo o que o app precisa fazer antes de mostrar a primeira tela:
// carregar as fontes, ler a biblioteca, preparar as notificações e
// decidir se abre as Boas-vindas (primeiro acesso) ou as abas.
export function useIniciarApp() {
  const [fontesCarregadas] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });
  const [telaInicial, setTelaInicial] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function preparar() {
      try {
        await carregarBiblioteca(); // jogos do SQLite para a store
        await configurarNotificacoes();
         await atualizarLembrete(); // lembrete dos 5 dias (conta da última interação)
      } catch (erro) {
        // Se algo falhar, o app abre assim mesmo (as telas mostram o erro)
        console.error('Erro ao iniciar o app:', erro);
      }

      const jaViuBoasVindas = await ler(CHAVES.onboardingVisto); // AsyncStorage
      setTelaInicial(jaViuBoasVindas ? 'Abas' : 'BoasVindas');
    }
    preparar();
  }, []);

  const pronto = fontesCarregadas && telaInicial !== null;

  // Tudo pronto: tira a splash da frente
  useEffect(() => {
    if (pronto) SplashScreen.hideAsync();
  }, [pronto]);

  return { pronto, telaInicial };
}