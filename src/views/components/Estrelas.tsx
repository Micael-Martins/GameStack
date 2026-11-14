import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { cores } from '../../theme';

export type EstrelasProps = {
  nota?: number | null;
  /** A presença do callback habilita a avaliação por toque. */
  onChange?: (nota: number) => void;
};

const notas = [1, 2, 3, 4, 5] as const;

export default function Estrelas({ nota, onChange }: EstrelasProps) {
  const notaAtual = typeof nota === 'number' && Number.isFinite(nota)
    ? Math.min(5, Math.max(0, Math.round(nota)))
    : 0;

  if (!onChange) {
    return (
      <View
        accessible
        accessibilityLabel={notaAtual === 0 ? 'Sem avaliação' : `${notaAtual} de 5 estrelas`}
        style={styles.leitura}
      >
        {notas.map((valor) => (
          <Ionicons
            key={valor}
            name={valor <= notaAtual ? 'star' : 'star-outline'}
            size={14}
            color={cores.texto}
            accessible={false}
          />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.interativas}>
      {notas.map((valor) => (
        <Pressable
          key={valor}
          accessibilityRole="button"
          accessibilityLabel={`${valor} ${valor === 1 ? 'estrela' : 'estrelas'}`}
          accessibilityState={{ selected: valor === notaAtual }}
          onPress={() => onChange(valor)}
          style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
        >
          <Ionicons
            name={valor <= notaAtual ? 'star' : 'star-outline'}
            size={28}
            color={cores.texto}
            accessible={false}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  leitura: { flexDirection: 'row', gap: 2 },
  interativas: { flexDirection: 'row' },
  botao: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressionado: { opacity: 0.6 },
});
