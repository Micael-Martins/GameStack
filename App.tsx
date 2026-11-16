import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useIniciarApp } from './src/inicializacao/useIniciarApp';
import RotasPrincipais from './src/navigation/RotasPrincipais';
import { temaNavegacao } from './src/navigation/temaNavegacao';

// Ponto de entrada do app: espera a inicialização e monta a navegação.
export default function App() {
  const { pronto, telaInicial } = useIniciarApp();

  // Enquanto não está pronto, a splash continua na frente
  if (!pronto || !telaInicial) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={temaNavegacao}>
        <StatusBar style="light" />
        <RotasPrincipais telaInicial={telaInicial} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}