import { StyleSheet } from 'react-native';

import { bordas, cores, tipografia } from '../../../../theme';

// Só o que é da tela Início. Fundo da tela e "apertado" vêm do estilosGlobais;
// cada parte (faixa, carrossel, card vazio, populares) tem o estilo dentro de components/.
export const styles = StyleSheet.create({
  conteudo: { paddingHorizontal: 20, paddingBottom: 24, gap: 22 },

  // Topo: saudação + engrenagem
  topo: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  textosTopo: { flex: 1, gap: 4 },
  saudacao: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: tipografia.tamanhos.titulo,
    letterSpacing: -0.5,
  },
  subtitulo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  botaoConfiguracoes: {
    width: 44,
    height: 44,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // A faixa fica um pouco mais perto do topo
  resumo: { marginTop: -6 },

  // "Jogados recentemente"
  listaRecentes: { gap: 10 },
});
