// Fontes e tamanhos de texto. No Android, o peso (fontWeight) não funciona com fonte
// personalizada: por isso cada peso é uma fonte diferente (regular, semiBold, extraBold).
export const tipografia = {
  fontes: {
    regular: 'PlusJakartaSans_400Regular',
    semiBold: 'PlusJakartaSans_600SemiBold',
    extraBold: 'PlusJakartaSans_800ExtraBold',
  },
  tamanhos: {
    titulo: 30,
    secao: 13,
    corpo: 15,
    legenda: 12,
  },
} as const;
