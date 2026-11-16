import { StyleSheet } from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '../../../../theme';

// Estilos da tela ConcluirJogo.
export const styles = StyleSheet.create({
  centro: { justifyContent: 'center', paddingHorizontal: espacamentos.gg },
  botaoVoltar: { alignSelf: 'stretch' },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  topo: { flexDirection: 'row', justifyContent: 'flex-end' },
  fechar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressionado: { opacity: 0.6 },

  cabecalho: { alignItems: 'center', gap: 6, marginTop: 4 },
  anel: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 8,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  selo: {
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 12,
    letterSpacing: 1.6,
  },
  titulo: {
    textAlign: 'center',
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 34,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  nomeJogo: {
    textAlign: 'center',
    color: cores.textoClaro,
    fontFamily: tipografia.fontes.regular,
    fontSize: 15,
    marginTop: 4,
  },
  resumo: {
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
    marginTop: 4,
  },

  cardNota: {
    alignItems: 'center',
    gap: 8,
    marginTop: espacamentos.gg,
    paddingVertical: 18,
    paddingHorizontal: espacamentos.g,
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  tituloNota: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 16 },
  textoNota: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  textoNotaEscolhida: { color: cores.texto, fontFamily: tipografia.fontes.semiBold },

  secao: { marginTop: espacamentos.gg },

  rodape: { gap: espacamentos.m, paddingHorizontal: espacamentos.gg, paddingTop: espacamentos.m, backgroundColor: cores.fundo },
  cardProximo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    padding: espacamentos.m,
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderStyle: 'dashed',
    borderColor: cores.bordaForte,
  },
  textosProximo: { flex: 1, minWidth: 0, gap: 2 },
  rotuloProximo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 11, letterSpacing: 1 },
  nomeProximo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 15 },
  botaoComecar: {
    minWidth: 92,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoComecar: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  erro: { textAlign: 'center', color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
