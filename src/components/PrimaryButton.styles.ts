import { StyleSheet } from 'react-native';

import { bordas, cores, tipografia } from '../theme';

// Estilos do PrimaryButton.
export const styles = StyleSheet.create({
  button: {
    height: 54,
    borderRadius: bordas.raios.botoes,
    backgroundColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.8 },
  inactive: { opacity: 0.5 },
  text: { color: cores.fundo, fontFamily: tipografia.fontes.extraBold, fontSize: 16 },
});