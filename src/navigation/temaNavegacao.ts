import { DarkTheme } from '@react-navigation/native';

import { cores } from '../theme';

// Cores que o React Navigation usa no fundo das telas e nas bordas (tema escuro do app).
export const temaNavegacao = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: cores.fundo,
    card: cores.fundo,
    border: cores.borda,
    text: cores.texto,
  },
};