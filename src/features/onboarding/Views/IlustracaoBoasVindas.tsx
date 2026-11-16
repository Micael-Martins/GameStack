import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Image, View } from 'react-native';

import { cores } from '../../../theme';
import { styles } from './styles/BoasVindasScreen.styles';

type Props = { topo: number; capas: string[] };

// Posição final de cada carta no leque (deslocamento para o lado e inclinação).
const LEQUE = {
  esquerda: { x: -76, graus: -14 },
  centro: { x: 0, graus: -3 },
  direita: { x: 76, graus: 13 },
};

// Inclinação de cada chip flutuante: controle, concluído, +2h, estrelas.
const INCLINACAO_CHIPS = [-10, 7, -8, 6];

// Ilustração do topo: 3 capas da RAWG em leque + chips flutuando, com animação de entrada.
export function IlustracaoBoasVindas({ topo, capas }: Props) {
  const cartas = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const chips = useRef(INCLINACAO_CHIPS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const todos = [...cartas, ...chips];

    // Acessibilidade: quem pediu "reduzir movimento" vê tudo já no lugar.
    AccessibilityInfo.isReduceMotionEnabled().then((reduzirMovimento) => {
      if (reduzirMovimento) {
        todos.forEach((valor) => valor.setValue(1));
        return;
      }

      Animated.sequence([
        // 1. cartas, uma de cada vez, da esquerda para a direita
        Animated.stagger(
          140,
          cartas.map((valor) => Animated.spring(valor, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true })),
        ),
        // 2. chips pulando, um depois do outro
        Animated.stagger(
          90,
          chips.map((valor) => Animated.spring(valor, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true })),
        ),
      ]).start();
    });
  }, [cartas, chips]);

  // Carta: sobe de baixo e gira até a posição do leque
  const animacaoCarta = (valor: Animated.Value, { x, graus }: { x: number; graus: number }) => ({
    opacity: valor.interpolate({ inputRange: [0, 0.2], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { translateX: x },
      { translateY: valor.interpolate({ inputRange: [0, 1], outputRange: [220, 0] }) },
      { rotate: valor.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${graus}deg`] }) },
    ],
  });

  // Chip: surge no próprio lugar com um pulinho
  const animacaoChip = (indice: number) => ({
    opacity: chips[indice].interpolate({ inputRange: [0, 0.2], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { rotate: `${INCLINACAO_CHIPS[indice]}deg` },
      { translateY: chips[indice].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
      { scale: chips[indice].interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
    ],
  });

  return (
    <View
      style={[styles.ilustracao, { paddingTop: topo }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.palco}>
        <Animated.View style={[styles.capa, animacaoCarta(cartas[0], LEQUE.esquerda)]}>
          {capas[1] && <Image source={{ uri: capas[1] }} style={styles.imagemCapa} />}
        </Animated.View>
        <Animated.View style={[styles.capa, animacaoCarta(cartas[2], LEQUE.direita)]}>
          {capas[2] && <Image source={{ uri: capas[2] }} style={styles.imagemCapa} />}
        </Animated.View>
        <Animated.View style={[styles.capa, styles.capaCentro, animacaoCarta(cartas[1], LEQUE.centro)]}>
          {capas[0] && <Image source={{ uri: capas[0] }} style={styles.imagemCapaCentro} />}
          <Animated.Text style={styles.chipJogando}>• JOGANDO</Animated.Text>
          <View style={styles.trilhoProgresso}>
            <View style={styles.preenchimentoProgresso} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.seloControle, animacaoChip(0)]}>
          <Ionicons name="game-controller" size={26} color={cores.texto} />
        </Animated.View>
        <Animated.Text style={[styles.flutuante, styles.chipConcluido, animacaoChip(1)]}>✓ CONCLUÍDO</Animated.Text>
        <Animated.Text style={[styles.flutuante, styles.chipHoras, animacaoChip(2)]}>+2h</Animated.Text>
        <Animated.Text style={[styles.flutuante, styles.estrelas, animacaoChip(3)]}>★★★★★</Animated.Text>
      </View>

      {/* Curva preta que separa a ilustração do formulário */}
      <View style={styles.curva}>
        <View style={styles.circuloCurva} />
      </View>
    </View>
  );
}
