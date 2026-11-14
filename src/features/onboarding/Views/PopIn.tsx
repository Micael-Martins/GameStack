import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, StyleSheet } from 'react-native';

type Props = {
  delay?: number; // espera (ms) antes de surgir, para entrar um depois do outro
  children: React.ReactNode;
};

// Faz o conteúdo surgir crescendo com um "pulinho" (efeito mola).
// Ocupa o palco inteiro, então as posições dos filhos continuam iguais.
export function PopIn({ delay = 0, children }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Respeita quem desativou animações no celular (acessibilidade).
    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) {
        progress.setValue(1);
        return;
      }
      Animated.spring(progress, {
        toValue: 1,
        delay,
        friction: 5, // menor = quica mais
        tension: 80, // maior = mais rápido
        useNativeDriver: true,
      }).start();
    });
  }, [delay, progress]);

  const animatedStyle = {
    opacity: progress.interpolate({ inputRange: [0, 0.4], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) },
      { scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
    ],
  };

  return (
    <Animated.View pointerEvents="none" style={[styles.layer, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});