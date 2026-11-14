import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import BibliotecaScreen from '../features/biblioteca/Views/BibliotecaScreen';
import InicioScreen from '../features/home/Views/InicioScreen';
import PesquisarScreen from '../features/pesquisar/Views/PesquisarScreen';
import ComponentesDemoScreen from '../features/componentes/Views/ComponentesDemoScreen';
import { cores } from '../theme';
import { TabParamList } from './tipos';

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabRouter() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.fundo,
          borderTopColor: cores.borda,
        },
        tabBarActiveTintColor: cores.texto,
        tabBarInactiveTintColor: cores.textoSecundario,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={InicioScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Pesquisar"
        component={PesquisarScreen}
        options={{
          title: 'Pesquisar',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Biblioteca"
        component={BibliotecaScreen}
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color, size }) => <Ionicons name="library-outline" size={size} color={color} />,
        }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="Componentes"
          component={ComponentesDemoScreen}
          options={{
            title: 'Componentes',
            tabBarIcon: ({ color, size }) => <Ionicons name="construct-outline" size={size} color={color} />,
          }}
        />
      )}
    </Tab.Navigator>
  );
}
