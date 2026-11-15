import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Jogo } from '../models/Jogo';
import { cores, espacamentos, tipografia } from '../theme';
import Capa from './Capa';
import { linhaResultado, textoTempoMedio } from './cardResultadoUtils';

type CardResultadoProps = {
  jogo: Jogo;
  naBiblioteca: boolean;
  onAdicionar: (jogo: Jogo) => void;
};

// Card de um jogo vindo da RAWG (ainda não salvo): mostra ano e tempo médio em
// vez de status e horas. Diferente do CardJogo, que é de um jogo da biblioteca.
function CardResultado({ jogo, naBiblioteca, onAdicionar }: CardResultadoProps) {
  const tempoMedio = textoTempoMedio(jogo.tempoMedio);
  const detalhes = linhaResultado(jogo);

  return (
    <View style={styles.card}>
      <Capa imagemURL={jogo.imagemURL} tamanho="M" descricao={`Capa de ${jogo.nome}`} />

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={2}>
          {jogo.nome}
        </Text>
        {detalhes ? (
          <Text style={styles.detalhes} numberOfLines={1}>
            {detalhes}
          </Text>
        ) : null}
        {tempoMedio ? (
          <View style={styles.linhaTempo}>
            <Ionicons name="time-outline" size={14} color={cores.textoSecundario} />
            <Text style={styles.detalhes}>{tempoMedio}</Text>
          </View>
        ) : null}
      </View>

      {naBiblioteca ? (
        <View style={styles.naBiblioteca} accessible accessibilityLabel="Já está na biblioteca">
          <Ionicons name="checkmark" size={15} color={cores.textoSecundario} />
          <Text style={styles.textoNaBiblioteca}>Na biblioteca</Text>
        </View>
      ) : (
        <Pressable
          onPress={() => onAdicionar(jogo)}
          accessibilityRole="button"
          accessibilityLabel={`Adicionar ${jogo.nome} à biblioteca`}
          style={({ pressed }) => [styles.botaoMais, pressed && styles.pressionado]}
        >
          <Ionicons name="add" size={24} color={cores.texto} />
        </Pressable>
      )}
    </View>
  );
}

// memo: a lista não redesenha os cards que não mudaram.
export default memo(CardResultado);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: espacamentos.m,
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  textos: { flex: 1, minWidth: 0, gap: 3 },
  nome: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 16, lineHeight: 21 },
  detalhes: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  linhaTempo: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 1 },
  botaoMais: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  naBiblioteca: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  textoNaBiblioteca: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 13 },
  pressionado: { opacity: 0.7 },
});
