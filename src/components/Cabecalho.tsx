import { Ionicons } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { cores, tipografia } from '../theme';

type CabecalhoProps = { titulo: string; subtitulo?: string; onVoltar?: () => void; acaoDireita?: ReactNode };

export default function Cabecalho({ titulo, subtitulo, onVoltar, acaoDireita }: CabecalhoProps) {
  return (
    <View style={styles.container}>
      {onVoltar ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Voltar" onPress={onVoltar} style={styles.voltar}>
          <Ionicons name="chevron-back" size={22} color={cores.texto} />
        </Pressable>
      ) : null}
      <View style={styles.textos}>
        <Text accessibilityRole="header" style={styles.titulo}>{titulo}</Text>
        {subtitulo ? <Text style={styles.subtitulo}>{subtitulo}</Text> : null}
      </View>
      {acaoDireita}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 56 },
  voltar: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  textos: { flex: 1, minWidth: 0 },
  titulo: { fontFamily: tipografia.fontes.extraBold, fontSize: 22, color: cores.texto },
  subtitulo: { fontFamily: tipografia.fontes.regular, fontSize: 12, color: cores.textoSecundario, marginTop: 3 },
});