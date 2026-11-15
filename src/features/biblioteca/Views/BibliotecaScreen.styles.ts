import { StyleSheet } from 'react-native';

import { cores, espacamentos, tipografia } from '../../../theme';

export const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  lista: { paddingHorizontal: espacamentos.m, paddingBottom: 32, gap: espacamentos.m },
  cabecalho: { gap: 8 },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 28 },
  subtitulo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  busca: { marginTop: 8 },
  filtros: { gap: 8, paddingRight: espacamentos.m },
  avisoErro: {
    borderWidth: 1,
    borderColor: cores.textoFraco,
    borderRadius: espacamentos.raios.cards,
    padding: espacamentos.m,
    gap: 8,
  },
  textoErro: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  acaoErro: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  // Expande a lista vazia sem centralizar o cabeçalho junto com o estado vazio.
  estado: { flexGrow: 1 },
  listaVazia: { flex: 1, justifyContent: 'center' },
  indicador: { paddingVertical: 32 },
  separador: { height: espacamentos.m },
});
