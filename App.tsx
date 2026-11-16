import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configurarNotificacoes, reagendarLembrete } from './src/data/services/notificationService';
import { CHAVES, ler } from './src/data/storage/preferencias';
import ConfiguracoesScreen from './src/features/configuracoes/Views/ConfiguracoesScreen';
import AdicionarJogoScreen from './src/features/pesquisar/Views/AdicionarJogoScreen';
import BoasVindasScreen from './src/features/onboarding/Views/BoasVindasScreen';
import TabRouter from './src/navigation/TabRouter';
import { RootStackParamList } from './src/navigation/tipos';
import { carregarBiblioteca } from './src/store/bibliotecaStore';
import { cores } from './src/theme';
import DetalhesJogoScreen from './src/features/biblioteca/Views/DetalhesJogoScreen';
import RegistrarHorasScreen from './src/features/biblioteca/Views/RegistrarHorasScreen';
import ConcluirJogoScreen from './src/features/biblioteca/Views/ConcluirJogoScreen';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cores.fundo,
    card: cores.fundo,
    border: cores.borda,
    text: cores.texto,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });

  // Tela inicial: boas-vindas no primeiro acesso, abas nos seguintes.
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        // O repositório abre o banco e a store informa falhas de carregamento.
        await carregarBiblioteca();
        await configurarNotificacoes();
        await reagendarLembrete(); // lembrete dos 5 dias (conta da última interação)
      } catch (error) {
        console.error('Erro ao iniciar o app:', error);
      }

      const seen = await ler(CHAVES.onboardingVisto); // AsyncStorage
      setInitialRoute(seen ? 'Abas' : 'BoasVindas');
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialRoute]);

  // Enquanto não sabe qual tela abrir, a splash continua na frente.
  if (!fontsLoaded || !initialRoute) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BoasVindas" component={BoasVindasScreen} />
          <Stack.Screen name="Abas" component={TabRouter} />
          <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ animation: 'ios_from_right' }} />
          <Stack.Screen name="AdicionarJogo" component={AdicionarJogoScreen} options={{ animation: 'ios_from_right' }} />
           <Stack.Screen name="DetalhesJogo" component={DetalhesJogoScreen} options={{ animation: 'ios_from_right' }} />
          <Stack.Screen name="RegistrarHoras" component={RegistrarHorasScreen} options={{ animation: 'ios_from_right' }} />
          {/* Comemoração: tela cheia subindo de baixo, fecha no X */}
          <Stack.Screen
            name="ConcluirJogo"
            component={ConcluirJogoScreen}
            options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
