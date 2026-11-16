import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, tipografia } from '../theme';

// Título de seção em maiúsculas ("JOGANDO AGORA") com um link opcional ("Ver todos").
type TituloSecaoProps = { titulo: string; link?: { texto: string; onPress: () => void } };

export default function TituloSecao({ titulo, link }: TituloSecaoProps) {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.titulo}>{titulo}</Text>
      {link ? (
        <Pressable accessibilityRole="button" onPress={link.onPress} style={styles.link}>
          <Text style={styles.textoLink}>{link.texto}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 44 },
  titulo: {
    flex: 1,
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 13,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  link: { minHeight: 44, justifyContent: 'center' },
  textoLink: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 12 },
});