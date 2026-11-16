import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { bordas, cores, tipografia } from '../../../../theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

type Props = {
  zerados: number;
  emAndamento: number;
  naFila: number;
  horas: number;
  apagado?: boolean; // biblioteca vazia: números em cinza escuro
};

// Faixa com os 4 números da Home (substitui os 4 quadradinhos do CardEstatistica).
export function FaixaResumo({ zerados, emAndamento, naFila, horas, apagado = false }: Props) {
  // "em andamento" é o rótulo mais comprido, por isso ocupa um pouco mais de espaço (flex 1.5)
  const itens: { icone: NomeIcone; valor: number; rotulo: string; flex: number }[] = [
    { icone: 'trophy-outline', valor: zerados, rotulo: 'zerados', flex: 1 },
    { icone: 'play-circle-outline', valor: emAndamento, rotulo: 'em andamento', flex: 1.5 },
    { icone: 'layers-outline', valor: naFila, rotulo: 'na fila', flex: 1 },
    { icone: 'time-outline', valor: horas, rotulo: 'horas', flex: 1 },
  ];

  return (
    <View
      style={styles.faixa}
      accessible
      accessibilityLabel={`Resumo: ${zerados} zerados, ${emAndamento} em andamento, ${naFila} na fila, ${horas} horas`}
    >
      {itens.map((item, indice) => (
        <View key={item.rotulo} style={[styles.item, { flex: item.flex }, indice > 0 && styles.divisoria]}>
          <View style={styles.linhaValor}>
            <Ionicons name={item.icone} size={15} color={apagado ? COR_APAGADA : cores.textoFraco} />
            <Text style={[styles.valor, apagado && styles.apagado]}>{item.valor}</Text>
          </View>
          <Text style={[styles.rotulo, apagado && styles.apagado]} numberOfLines={1}>
            {item.rotulo}
          </Text>
        </View>
      ))}
    </View>
  );
}

const COR_APAGADA = cores.textoApagado;

const styles = StyleSheet.create({
  faixa: { flexDirection: 'row', gap: 10 },
  item: { minWidth: 0, gap: 4 },
  divisoria: { borderLeftWidth: bordas.fina, borderLeftColor: cores.borda, paddingLeft: 10 },
  linhaValor: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  valor: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 21, letterSpacing: -0.5 },
  rotulo: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },
  apagado: { color: COR_APAGADA },
});
