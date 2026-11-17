import type { NavigatorScreenParams } from '@react-navigation/native';

import type { Jogo } from '../models/Jogo';
import type { FiltroBiblioteca } from '../features/biblioteca/Model/filtrosBiblioteca';

// Telas da pilha principal e o que cada uma recebe ao abrir.
export type RootStackParamList = {
  Abas: NavigatorScreenParams<TabParamList> | undefined;
  BoasVindas: undefined;
  Configuracoes: undefined;
  AdicionarJogo: { jogo: Jogo };
  DetalhesJogo: { id: string }; // id do jogo na biblioteca
  RegistrarHoras: { id: string };
  ConcluirJogo: { id: string };
};

// Abas da barra de baixo.
export type TabParamList = {
  Inicio: undefined;
  Pesquisar: undefined;
  Biblioteca: { filtro?: FiltroBiblioteca } | undefined; // filtro: abrir já filtrada
};
