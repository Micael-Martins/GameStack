import { StyleSheet } from 'react-native';

import { bordas, cores, espacamentos, tipografia } from '../../../../theme';

// Estilos da tela Configuracoes.
export const styles = StyleSheet.create({
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg },
  flex: { flex: 1 },
  secao: { marginTop: espacamentos.gg, gap: espacamentos.p },
  card: {
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.card,
    overflow: 'hidden',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    minHeight: 56,
    paddingHorizontal: espacamentos.g,
    paddingVertical: espacamentos.m,
  },
  divisor: { borderTopWidth: bordas.fina, borderTopColor: cores.borda },
  linhaAnimada: { minHeight: 0, paddingVertical: 0, overflow: 'hidden' },
  texto: { color: cores.texto, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.corpo },
  textoForte: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: tipografia.tamanhos.corpo },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
    marginTop: 2,
  },
  valor: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.corpo },
  horario: {
    width: 84,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: bordas.raios.pequeno,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: tipografia.tamanhos.corpo,
  },
  horarioErro: { borderColor: cores.textoSecundario, borderStyle: 'dashed' },
  erro: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
    paddingHorizontal: espacamentos.g,
    paddingBottom: espacamentos.m,
  },
  aviso: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.legenda },
  versao: {
    marginTop: 32,
    textAlign: 'center',
    color: cores.textoFraco,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
});
