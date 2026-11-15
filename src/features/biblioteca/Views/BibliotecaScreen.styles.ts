import { StyleSheet } from 'react-native';

import { cores, tipografia } from '../../../theme';

export const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  pressionado: { opacity: 0.7 },

  // Topo
  topo: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20 },
  textosTopo: { flex: 1, gap: 4 },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 30, letterSpacing: -0.5 },
  resumo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  botaoAdicionar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filtros (a rolagem vai até a borda da tela)
  filtros: { flexGrow: 0, marginTop: 18 },
  conteudoFiltros: { gap: 8, paddingHorizontal: 20 },

  // "Por última sessão · Mostrando X de Y"
  linhaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
  },
  textoOrdem: { color: cores.textoFraco, fontFamily: tipografia.fontes.semiBold, fontSize: 11, letterSpacing: 0.8 },
  textoMostrando: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },

  // Lista
  lista: { paddingHorizontal: 20, paddingBottom: 24, flexGrow: 1 },
  separador: { height: 10 },

  // Biblioteca vazia
  centro: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 60 },
});