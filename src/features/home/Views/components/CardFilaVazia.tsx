import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../../../../components/PrimaryButton';
import { bordas, cores, tipografia } from '../../../../theme';

type Props = { onPesquisar: () => void };

// Biblioteca vazia: convite para pesquisar o primeiro jogo.
export function CardFilaVazia({ onPesquisar }: Props) {
  return (
    <View style={styles.card}>
      {/* Desenho de capas tracejadas (só decoração, o leitor de tela ignora) */}
      <View style={styles.desenho} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.capaFantasma, styles.capaEsquerda]} />
        <View style={[styles.capaFantasma, styles.capaDireita]} />
        <View style={styles.capaCentro}>
          <Ionicons name="add" size={22} color={cores.textoFraco} />
        </View>
        <View style={styles.anel} />
      </View>

      <View style={styles.textos}>
        <Text style={styles.titulo}>Sua fila está vazia</Text>
        <Text style={styles.descricao}>
          Adicione os jogos que você já tem e ainda não terminou. Comece pelo que mais tem vontade de zerar.
        </Text>
      </View>

      <PrimaryButton title="Pesquisar jogos" onPress={onPesquisar} style={styles.botao} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    borderRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 18,
    alignItems: 'center',
    gap: 12,
  },
  desenho: { width: 136, height: 96 },
  capaFantasma: {
    position: 'absolute',
    top: 16,
    width: 48,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: cores.bordaForte,
  },
  capaEsquerda: { left: 6, transform: [{ rotate: '-12deg' }] },
  capaDireita: { right: 6, transform: [{ rotate: '12deg' }] },
  capaCentro: {
    position: 'absolute',
    left: 40,
    top: 2,
    width: 56,
    height: 76,
    borderRadius: bordas.raios.pequeno,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: cores.bordaTracejada,
    backgroundColor: cores.fundoProfundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anel: {
    position: 'absolute',
    left: 50,
    bottom: -4,
    width: 36,
    height: 36,
    borderRadius: bordas.raios.cards,
    borderWidth: 6,
    borderColor: cores.bordaForte,
    backgroundColor: cores.card,
  },
  textos: { alignItems: 'center', gap: 8 },
  titulo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 270,
  },
  botao: { alignSelf: 'stretch' },
});
