import { Pressable, StyleSheet, View } from 'react-native';
import { cores } from '../theme';

type InterruptorProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

export default function Interruptor({ value, onValueChange, accessibilityLabel, disabled = false }: InterruptorProps) {
  // O controle desenhado mantém as mesmas cores nas duas plataformas, com semântica nativa de switch.
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.toque, disabled && styles.desabilitado]}
    >
      <View style={[styles.trilho, value && styles.ligado]}>
        <View style={[styles.botao, value && styles.botaoLigado]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toque: { minWidth: 52, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  trilho: { width: 52, height: 32, borderRadius: 16, padding: 3, backgroundColor: '#3A3A3A' },
  ligado: { backgroundColor: cores.texto },
  botao: { width: 26, height: 26, borderRadius: 13, backgroundColor: cores.texto },
  botaoLigado: { alignSelf: 'flex-end', backgroundColor: cores.fundo },
  desabilitado: { opacity: 0.5 },
});