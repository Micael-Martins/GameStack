import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConcluirJogoScreen from '../features/biblioteca/Views/ConcluirJogoScreen';
import DetalhesJogoScreen from '../features/biblioteca/Views/DetalhesJogoScreen';
import RegistrarHorasScreen from '../features/biblioteca/Views/RegistrarHorasScreen';
import ConfiguracoesScreen from '../features/configuracoes/Views/ConfiguracoesScreen';
import BoasVindasScreen from '../features/onboarding/Views/BoasVindasScreen';
import AdicionarJogoScreen from '../features/pesquisar/Views/AdicionarJogoScreen';
import TabRouter from './TabRouter';
import type { RootStackParamList } from './tipos';

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = { telaInicial: keyof RootStackParamList };

// Pilha principal do app: as abas e as telas que abrem por cima delas.
export default function RotasPrincipais({ telaInicial }: Props) {
  return (
    <Stack.Navigator initialRouteName={telaInicial} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BoasVindas" component={BoasVindasScreen} />
      <Stack.Screen name="Abas" component={TabRouter} />
      <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ animation: 'ios_from_right' }} />
      <Stack.Screen name="AdicionarJogo" component={AdicionarJogoScreen} options={{ animation: 'ios_from_right' }} />
      <Stack.Screen name="DetalhesJogo" component={DetalhesJogoScreen} options={{ animation: 'ios_from_right' }} />
      <Stack.Screen name="RegistrarHoras" component={RegistrarHorasScreen} options={{ animation: 'ios_from_right' }} />
      {/* Comemoração: sobe de baixo e só fecha pelo X ou pelo Salvar */}
      <Stack.Screen
        name="ConcluirJogo"
        component={ConcluirJogoScreen}
        options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}