import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Image, View } from 'react-native';

import { cores } from '../../../theme';
import { styles } from './OnBoardingScreen.styles';

type Props = { top: number; covers: string[] };

const FAN = {
  left: { x: -76, deg: -14 },
  center: { x: 0, deg: -3 },
  right: { x: 76, deg: 13 },
};

const CHIP_TILT = [-10, 7, -8, 6];

export function OnBoardingIllustration({ top, covers }: Props) {
  const cards = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  const chips = useRef(CHIP_TILT.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const all = [...cards, ...chips];

    AccessibilityInfo.isReduceMotionEnabled().then((reduceMotion) => {
      if (reduceMotion) {
        all.forEach((value) => value.setValue(1));
        return;
      }

      Animated.sequence([
        // 1. cartas, uma de cada vez, da esquerda para a direita
        Animated.stagger(
          140,
          cards.map((value) => Animated.spring(value, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true })),
        ),
        // 2. chips pulando, um depois do outro
        Animated.stagger(
          90,
          chips.map((value) => Animated.spring(value, { toValue: 1, friction: 4, tension: 120, useNativeDriver: true })),
        ),
      ]).start();
    });
  }, [cards, chips]);

  // Carta: sobe de baixo e gira até a posição do leque
  const cardAnim = (value: Animated.Value, { x, deg }: { x: number; deg: number }) => ({
    opacity: value.interpolate({ inputRange: [0, 0.2], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { translateX: x },
      { translateY: value.interpolate({ inputRange: [0, 1], outputRange: [220, 0] }) },
      { rotate: value.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${deg}deg`] }) },
    ],
  });

  // Chip: surge no próprio lugar com um pulinho
  const chipAnim = (index: number) => ({
    opacity: chips[index].interpolate({ inputRange: [0, 0.2], outputRange: [0, 1], extrapolate: 'clamp' }),
    transform: [
      { rotate: `${CHIP_TILT[index]}deg` },
      { translateY: chips[index].interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) },
      { scale: chips[index].interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }) },
    ],
  });

  return (
    <View
      style={[styles.illustration, { paddingTop: top }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.stage}>
        <Animated.View style={[styles.cover, cardAnim(cards[0], FAN.left)]}>
          {covers[1] && <Image source={{ uri: covers[1] }} style={styles.coverImage} />}
        </Animated.View>
        <Animated.View style={[styles.cover, cardAnim(cards[2], FAN.right)]}>
          {covers[2] && <Image source={{ uri: covers[2] }} style={styles.coverImage} />}
        </Animated.View>
        <Animated.View style={[styles.cover, styles.coverCenter, cardAnim(cards[1], FAN.center)]}>
          {covers[0] && <Image source={{ uri: covers[0] }} style={styles.coverImageCenter} />}
          <Animated.Text style={styles.playingChip}>• JOGANDO</Animated.Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.iconBadge, chipAnim(0)]}>
          <Ionicons name="game-controller" size={26} color={cores.texto} />
        </Animated.View>
        <Animated.Text style={[styles.floating, styles.doneChip, chipAnim(1)]}>✓ CONCLUÍDO</Animated.Text>
        <Animated.Text style={[styles.floating, styles.hoursChip, chipAnim(2)]}>+2h</Animated.Text>
        <Animated.Text style={[styles.floating, styles.stars, chipAnim(3)]}>★★★★★</Animated.Text>
      </View>

      <View style={styles.curve}>
        <View style={styles.curveCircle} />
      </View>
    </View>
  );
}