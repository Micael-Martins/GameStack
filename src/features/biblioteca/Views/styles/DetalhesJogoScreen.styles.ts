import { StyleSheet } from 'react-native';

import { bordas, cores, tipografia } from '../../../../theme';

export const styles = StyleSheet.create({
  conteudo: { paddingHorizontal: 20, paddingBottom: 24, gap: 16 },

  // Topo: voltar e lixeira
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  botaoVoltar: { width: 44, height: 44, marginLeft: -10, alignItems: 'center', justifyContent: 'center' },

  // Capa e dados
  cabecalhoJogo: { flexDirection: 'row', gap: 16 },
  textosJogo: { flex: 1, minWidth: 0, justifyContent: 'center', gap: 6 },
  nome: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 22, lineHeight: 26 },
  detalhe: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },

  // Cards (status e tempo)
  card: {
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    borderRadius: bordas.raios.cards,
    padding: 16,
    gap: 10,
  },
  cardStatus: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  fraseStatus: { flex: 1, minWidth: 0, color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  linhaTempo: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  horas: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 28, letterSpacing: -0.5 },
  legenda: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },

  // Botão com borda branca: o visual vem do estilosGlobais.botaoContorno; aqui só o tamanho
  botaoContorno: { height: 46, marginTop: 4 },

  // Lista de datas
  informacoes: { borderTopWidth: bordas.fina, borderTopColor: cores.divisoria },
  linhaInformacao: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: bordas.fina,
    borderBottomColor: cores.divisoria,
  },
  rotuloInformacao: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  valorInformacao: { color: cores.texto, fontFamily: tipografia.fontes.regular, fontSize: 14 },

  // Anotação
  secaoAnotacao: { gap: 8 },
  tituloAnotacao: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 13, letterSpacing: 0.8 },
  erro: { color: cores.texto, fontFamily: tipografia.fontes.regular, fontSize: 13 },

  // Barra de baixo
  rodape: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: bordas.fina,
    borderTopColor: cores.divisoria,
    backgroundColor: cores.fundo,
  },
  botaoRodape: { flex: 1, height: 54, marginTop: 0, borderRadius: bordas.raios.botoes },
});