import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { bordas, cores } from '../theme';

type InterruptorProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
};

const DESLOCAMENTO = 20; // trilho 52 - botão 26 - padding 3 * 2
const COR_DESLIGADO = cores.bordaForte;

export default function Interruptor({ value, onValueChange, accessibilityLabel, disabled = false }: InterruptorProps) {
  // 0 = desligado, 1 = ligado. A mola faz o botão deslizar com um leve quique.
  const progresso = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progresso, {
      toValue: value ? 1 : 0,
      friction: 6,
      tension: 120,
      useNativeDriver: false, // cores não rodam no driver nativo
    }).start();
  }, [value, progresso]);

  const corTrilho = progresso.interpolate({ inputRange: [0, 1], outputRange: [COR_DESLIGADO, cores.texto] });
  const corBotao = progresso.interpolate({ inputRange: [0, 1], outputRange: [cores.texto, cores.fundo] });
  const posicao = progresso.interpolate({ inputRange: [0, 1], outputRange: [0, DESLOCAMENTO] });

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
      <Animated.View style={[styles.trilho, { backgroundColor: corTrilho }]}>
        <Animated.View style={[styles.botao, { backgroundColor: corBotao, transform: [{ translateX: posicao }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toque: { minWidth: 52, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  trilho: { width: 52, height: 32, borderRadius: bordas.raios.botoes, padding: 3 },
  botao: { width: 26, height: 26, borderRadius: 13 },
  desabilitado: { opacity: 0.5 },
});
