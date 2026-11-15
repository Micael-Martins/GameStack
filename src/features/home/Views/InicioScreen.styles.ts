import { StyleSheet } from 'react-native';

import { cores, tipografia } from '../../../theme';

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: cores.fundo },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 22 },

  // Topo: saudação + engrenagem
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  headerTexts: { flex: 1, gap: 4 },
  greeting: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: tipografia.tamanhos.titulo,
    letterSpacing: -0.5,
  },
  subtitle: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },

  // Card de fila vazia
  emptyCard: {
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
  // Ilustração: 3 capas tracejadas, um "+" no meio e um anel vazio
  emptyArt: { width: 136, height: 96 },
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
  emptyTexts: { alignItems: 'center', gap: 8 },
  emptyTitle: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 22,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  emptyDescription: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 270,
  },
  emptyButton: { alignSelf: 'stretch' },

  // Estatísticas (4 quadradinhos)
  stats: { flexDirection: 'row', gap: 8 },
  statCard: {
    flex: 1,
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 2,
  },
  statValue: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 20 },
  statLabel: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 11 },
  statValueDimmed: { color: '#4A4A4A' },
  statLabelDimmed: { color: '#6B6B6B' },

  // Populares agora
  popularList: { gap: 12, paddingRight: 20 },
  popularRow: { marginRight: -20 }, // a fileira vai até a borda da tela
  popularItem: { width: 92, gap: 4 },
  popularCover: {
    width: 92,
    height: 122,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.borda,
  },
  popularName: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 13, marginTop: 2 },
  popularGenre: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 11 },
});