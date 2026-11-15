import { StyleSheet } from 'react-native';

import { cores, tipografia } from '../../../theme';

// Só o que é da tela em si. Cada parte (faixa, carrossel, card vazio, populares)
// tem os próprios estilos dentro de components/.
export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: cores.fundo },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 22 },
  pressed: { opacity: 0.7 },

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

  // A faixa fica um pouco mais perto do topo
  summary: { marginTop: -6 },

  // "Jogados recentemente"
  recentList: { gap: 10 },

  // Botão de teste (só em desenvolvimento)
  devButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#5A5A5A',
  },
  devButtonText: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },
});