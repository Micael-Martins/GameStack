import { StyleSheet } from 'react-native';

import { bordas } from './bordas';
import { cores } from './cores';
import { tipografia } from './tipografia';

// Padrões que se repetem em várias telas. Cada tela usa estes e só cria no seu
// arquivo de estilos (Views/styles/) o que é dela.
export const estilosGlobais = StyleSheet.create({
  // Fundo de toda tela
  tela: { flex: 1, backgroundColor: cores.fundo },

  // Efeito de "apertado" ao tocar
  pressionado: { opacity: 0.7 },

  // Card padrão: fundo, borda e cantos
  card: {
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    borderRadius: bordas.raios.cards,
  },

  // Botão com borda branca (Registrar horas, Mudar status)
  botaoContorno: {
    borderRadius: bordas.raios.campos,
    borderWidth: bordas.fina,
    borderColor: cores.texto,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  textoBotaoContorno: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 15 },

  // Textos que aparecem igual em várias telas
  textoSecundario: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  erro: { color: cores.erro, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
