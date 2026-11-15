import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Jogo } from '../models/Jogo';

export type RootStackParamList = {
  Abas: NavigatorScreenParams<TabParamList> | undefined;
  BoasVindas: undefined;
  Configuracoes: undefined;
  AdicionarJogo: { jogo: Jogo };
  FormularioDemo: undefined;
};

export type TabParamList = {
  Inicio: undefined;
  Pesquisar: undefined;
  Biblioteca: undefined;
  Componentes: undefined;
};
