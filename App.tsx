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

import { initDatabase } from './src/data/db/database';
import BoasVindasScreen from './src/features/onboarding/Views/BoasVindasScreen';
import TabRouter from './src/navigation/TabRouter';
import { RootStackParamList } from './src/navigation/tipos';
import { cores } from './src/theme';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator<RootStackParamList>();

const temaNavegacao = {
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
  const [fontesCarregadas] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });
  const [bancoPronto, setBancoPronto] = useState(false);

  useEffect(() => {
    initDatabase()
      .catch((erro) => console.error('Erro ao iniciar o banco:', erro))
      .finally(() => setBancoPronto(true));
  }, []);

  useEffect(() => {
    if (fontesCarregadas && bancoPronto) {
      SplashScreen.hideAsync();
    }
  }, [fontesCarregadas, bancoPronto]);

  if (!fontesCarregadas || !bancoPronto) {
    return null;
  }

  return (
    <NavigationContainer theme={temaNavegacao}>
      <StatusBar style="light" />
      <Stack.Navigator initialRouteName="Abas" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Abas" component={TabRouter} />
        <Stack.Screen name="BoasVindas" component={BoasVindasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
