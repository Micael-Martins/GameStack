// Espessura das bordas e arredondamento dos cantos.
export const bordas = {
  fina: 1,
  raios: {
    pequeno: 12, // capas, botões pequenos, selos
    campos: 14, // campos de texto e opções de lista
    botoes: 16, // botões grandes
    cards: 18, // cards
    chips: 999, // pílulas (chips e status)
  },
} as const;
