import { StyleSheet } from 'react-native';

import { cores, espacamentos, tipografia } from '../../../../theme';

// Estilos da tela Pesquisar.
export const styles = StyleSheet.create({
  topo: { paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: tipografia.tamanhos.titulo },
  subtitulo: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    marginTop: 2,
    marginBottom: espacamentos.gg,
  },
  conteudo: { flex: 1 },
  rolagem: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  aviso: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
    marginBottom: espacamentos.m,
    textAlign: 'center',
  },
  recentes: { marginBottom: espacamentos.gg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacamentos.p, marginTop: espacamentos.p },
  vazio: { flexGrow: 1, minHeight: 280 },
  lista: { paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  separador: { height: espacamentos.m },
  centro: { flex: 1, justifyContent: 'center', paddingHorizontal: espacamentos.gg, paddingBottom: 60 },
  textoCarregando: {
    marginTop: espacamentos.m,
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
  },
  mais: { marginTop: espacamentos.g },
  credito: {
    marginTop: espacamentos.gg,
    textAlign: 'center',
    color: cores.textoFraco,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
});
