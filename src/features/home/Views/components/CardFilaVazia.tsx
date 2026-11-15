import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../../../components/PrimaryButton';
import { cores, tipografia } from '../../../../theme';

type Props = { onSearch: () => void };

// Biblioteca vazia: convite para pesquisar o primeiro jogo.
export function EmptyQueueCard({ onSearch }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.art} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.ghostCover, styles.ghostLeft]} />
        <View style={[styles.ghostCover, styles.ghostRight]} />
        <View style={styles.ghostCenter}>
          <Ionicons name="add" size={22} color={cores.textoFraco} />
        </View>
        <View style={styles.ghostRing} />
      </View>

      <View style={styles.texts}>
        <Text style={styles.title}>Sua fila está vazia</Text>
        <Text style={styles.description}>
          Adicione os jogos que você já tem e ainda não terminou. Comece pelo que mais tem vontade de zerar.
        </Text>
      </View>

      <PrimaryButton title="Pesquisar jogos" onPress={onSearch} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 18,
    alignItems: 'center',
    gap: 12,
  },
  art: { width: 136, height: 96 },
  ghostCover: {
    position: 'absolute',
    top: 16,
    width: 48,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#3A3A3A',
  },
  ghostLeft: { left: 6, transform: [{ rotate: '-12deg' }] },
  ghostRight: { right: 6, transform: [{ rotate: '12deg' }] },
  ghostCenter: {
    position: 'absolute',
    left: 40,
    top: 2,
    width: 56,
    height: 76,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#5A5A5A',
    backgroundColor: '#0F0F0F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostRing: {
    position: 'absolute',
    left: 50,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 6,
    borderColor: '#3A3A3A',
    backgroundColor: cores.card,
  },
  texts: { alignItems: 'center', gap: 8 },
  title: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  description: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 270,
  },
  button: { alignSelf: 'stretch' },
});