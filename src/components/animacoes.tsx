import { ReactNode, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

// Animações básicas reaproveitadas pelas telas. Todas usam o driver nativo
// (opacidade e transform) e respeitam a opção "reduzir movimento" do celular.

let reduzirMovimento = false;
AccessibilityInfo.isReduceMotionEnabled()
  .then((ativo) => {
    reduzirMovimento = ativo;
  })
  .catch(() => {});
AccessibilityInfo.addEventListener?.('reduceMotionChanged', (ativo) => {
  reduzirMovimento = ativo;
});

type EntradaAnimadaProps = {
  children: ReactNode;
  atraso?: number; // ms antes de começar (para entrar em sequência)
  deslocamento?: number; // de quantos px de baixo o conteúdo sobe
  style?: StyleProp<ViewStyle>;
};

// Aparece suavemente subindo um pouco. Para animar de novo quando algo muda,
// troque a `key` do componente.
export function EntradaAnimada({ children, atraso = 0, deslocamento = 12, style }: EntradaAnimadaProps) {
  const progresso = useRef(new Animated.Value(reduzirMovimento ? 1 : 0)).current;

  useEffect(() => {
    if (reduzirMovimento) return;
    const animacao = Animated.timing(progresso, {
      toValue: 1,
      duration: 280,
      delay: atraso,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animacao.start();
    return () => animacao.stop();
  }, [progresso, atraso]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progresso,
          transform: [{ translateY: progresso.interpolate({ inputRange: [0, 1], outputRange: [deslocamento, 0] }) }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Atraso de cada item de uma lista: só os primeiros entram em sequência,
// o resto aparece junto (para não demorar em listas grandes).
export function atrasoDaLista(indice: number, passo = 45, maximoEmSequencia = 8): number {
  return indice < maximoEmSequencia ? indice * passo : 0;
}

type ToqueAnimadoProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

// Pressable que afunda um pouco ao tocar (em vez de só piscar).
export function ToqueAnimado({ style, children, onPressIn, onPressOut, ...props }: ToqueAnimadoProps) {
  const escala = useRef(new Animated.Value(1)).current;

  function animar(valor: number) {
    if (reduzirMovimento) return;
    Animated.spring(escala, { toValue: valor, friction: 6, tension: 220, useNativeDriver: true }).start();
  }

  return (
    <Pressable
      {...props}
      onPressIn={(e) => {
        animar(0.96);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        animar(1);
        onPressOut?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale: escala }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
