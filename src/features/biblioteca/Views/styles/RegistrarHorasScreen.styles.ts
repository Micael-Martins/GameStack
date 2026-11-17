import { StyleSheet } from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '../../../../theme';

// Estilos da tela RegistrarHoras.
export const styles = StyleSheet.create({
  margem: { paddingHorizontal: espacamentos.gg },
  centro: { flex: 1, justifyContent: 'center' },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.gg },
  pressionado: { opacity: 0.6 },

  cardTotal: {
    alignItems: 'center',
    gap: 4,
    marginTop: espacamentos.m,
    paddingVertical: 22,
    paddingHorizontal: espacamentos.g,
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  rotuloTotal: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  total: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 44, letterSpacing: -1 },
  sessao: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  areaBarra: { alignSelf: 'stretch', gap: 8, marginTop: 14 },
  linhaBarra: { flexDirection: 'row', justifyContent: 'space-between' },
  legenda: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },

  secao: { marginTop: espacamentos.gg, gap: espacamentos.p },
  botoes: { flexDirection: 'row', gap: espacamentos.p },
    itemSoma: { flex: 1 },
 
  botaoSoma: {
    minHeight: 52,
    borderRadius: bordas.raios.campos,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoSoma: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 16 },
  desfazer: { alignSelf: 'center', minHeight: 44, paddingHorizontal: 16, justifyContent: 'center' },
  textoDesfazer: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  desabilitado: { opacity: 0.4 },

  rodape: { gap: espacamentos.p, paddingHorizontal: espacamentos.gg, paddingTop: espacamentos.m, backgroundColor: cores.fundo },
  aviso: { textAlign: 'center', color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  erro: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
