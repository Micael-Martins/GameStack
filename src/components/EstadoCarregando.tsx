import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { cores, espacamentos, tipografia } from '../theme';

// Indicador de carregando com mensagem, igual em todas as telas.
interface EstadoCarregandoProps {
  mensagem?: string;
}

export default function EstadoCarregando({
  mensagem = 'Carregando...',
}: EstadoCarregandoProps) {
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel={mensagem}
    >
      <ActivityIndicator size="large" color={cores.texto} />

      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: espacamentos.gg,
    gap: espacamentos.m,
  },
  mensagem: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    textAlign: 'center',
  },
});
