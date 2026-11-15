import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Jogo } from '../models/Jogo';
import type { FiltroBiblioteca } from '../features/biblioteca/Model/filtrosBiblioteca';

export type RootStackParamList = {
  Abas: NavigatorScreenParams<TabParamList> | undefined;
  BoasVindas: undefined;
  Configuracoes: undefined;
  AdicionarJogo: { jogo: Jogo };
   DetalhesJogo: { id: string };
  FormularioDemo: undefined;
};

export type TabParamList = {
  Inicio: undefined;
  Pesquisar: undefined;
  Biblioteca: { filtro?: FiltroBiblioteca } | undefined; // filtro: abrir já filtrada  Componentes: undefined;
};
