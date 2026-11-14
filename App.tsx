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

import { obterBanco } from './src/data/db/database';
import OnBoardingScreen from './src/features/onboarding/Views/OnBoardingScreen';
import TabRouter from './src/navigation/TabRouter';
import { RootStackParamList } from './src/navigation/tipos';
import { cores } from './src/theme';
import { CHAVES, ler, limparTudo } from './src/data/storage/preferencias';
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

  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
          await obterBanco();
      } catch (error) {
        console.error('Erro ao iniciar o banco:', error);
      }
const seen = await ler(CHAVES.onboardingVisto);
      setInitialRoute(seen ? 'Abas' : 'BoasVindas');

    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialRoute]);

  if (!fontsLoaded || !initialRoute) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navigationTheme}>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="BoasVindas" component={OnBoardingScreen} />
          <Stack.Screen name="Abas" component={TabRouter} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}