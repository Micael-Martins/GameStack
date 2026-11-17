import { StyleSheet } from 'react-native';

import { bordas, cores, tipografia } from '../../../../theme';

// Cinza claro enquanto a capa da RAWG não carrega
const COR_CAPA_VAZIA = '#E5E5E5';

export const styles = StyleSheet.create({
    conteudo: { flexGrow: 1 },

  // ---------- Ilustração do topo ----------
  ilustracao: { backgroundColor: cores.fundoClaro, overflow: 'hidden' },
  palco: { height: 300, alignItems: 'center', justifyContent: 'center' },

  // Sombra + borda fraca para a capa não "sumir" no fundo branco
  capa: {
    position: 'absolute',
    width: 112,
    height: 150,
    borderRadius: 16,
    borderWidth: bordas.fina,
    borderColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: COR_CAPA_VAZIA,
    boxShadow: '0px 10px 24px rgba(0, 0, 0, 0.22)',
  },
  capaCentro: {
    width: 146,
    height: 196,
    borderRadius: 18,
    padding: 12,
    justifyContent: 'space-between',
    boxShadow: '0px 16px 32px rgba(0, 0, 0, 0.35)',
  },
  // 1 a menos que o card, por causa da borda de 1px
  imagemCapa: { width: '100%', height: '100%', borderRadius: 15 },
  imagemCapaCentro: { ...StyleSheet.absoluteFill, borderRadius: 17 },

  chipJogando: {
    alignSelf: 'flex-start',
    backgroundColor: cores.fundo,
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 10,
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: bordas.raios.chips,
    overflow: 'hidden',
  },
  trilhoProgresso: { height: 6, borderRadius: bordas.raios.chips, backgroundColor: 'rgba(0,0,0,0.35)', overflow: 'hidden' },
  preenchimentoProgresso: { width: '84%', height: '100%', borderRadius: bordas.raios.chips, backgroundColor: '#FFFFFF' },

  seloControle: {
    position: 'absolute',
    top: 28,
    left: 28,
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 8px 18px rgba(0, 0, 0, 0.2)',
  },
  flutuante: { position: 'absolute', overflow: 'hidden', fontFamily: tipografia.fontes.extraBold },
  chipConcluido: {
    top: 48,
    right: 20,
    backgroundColor: cores.fundo,
    color: cores.texto,
    fontSize: 12,
    letterSpacing: 0.6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: bordas.raios.chips,
  },
  chipHoras: {
    bottom: 34,
    left: 26,
    color: cores.fundo,
    backgroundColor: cores.texto,
    borderWidth: 2,
    borderColor: cores.fundo,
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: bordas.raios.pequeno,
  },
  estrelas: {
    bottom: 38,
    right: 28,
    color: cores.texto,
    backgroundColor: cores.fundo,
    fontSize: 13,
    letterSpacing: 2,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: bordas.raios.pequeno,
  },
  curva: { height: 32, alignItems: 'center' },
  circuloCurva: {
    position: 'absolute',
    top: 0,
    width: 1400,
    height: 1400,
    borderRadius: 700,
    backgroundColor: cores.fundo,
  },

  // ---------- Formulário ----------
  corpo: { flex: 1, paddingHorizontal: 24, paddingTop: 8, gap: 16 },
  textos: { alignItems: 'center', gap: 8, marginBottom: 8 },
  titulo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: tipografia.tamanhos.titulo,
    textAlign: 'center',
    letterSpacing: -0.8,
  },
  subtitulo: {
    color: '#BDBDBD',
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.corpo,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
  espacador: { flex: 1 },

  cardLembrete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    borderRadius: bordas.raios.botoes,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textosLembrete: { flex: 1, gap: 3 },
  tituloLembrete: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 15 },
  descricaoLembrete: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },

  erro: { color: cores.erro, fontFamily: tipografia.fontes.regular, fontSize: 13, textAlign: 'center' },
  botaoComecar: { marginTop: 8 },
  rodape: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12, textAlign: 'center' },
});
