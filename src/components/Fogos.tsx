import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { movimentoReduzido } from './animacoes';

// Fogos de artifício em preto e branco para comemorar (tela Concluir jogo).
// Cada partícula é uma View pequena com um único Animated.Value de 0 a 1;
// o interpolate transforma esse 0 → 1 no voo inteiro (posição, gravidade, tamanho, giro e brilho).

const CORES = ['#FAFAFA', '#D4D4D4', '#A3A3A3', '#737373'];
const FORMATOS = ['ponto', 'traco', 'quadrado'] as const;

type Particula = {
  angulo: number;
  distancia: number;
  tamanho: number;
  formato: (typeof FORMATOS)[number];
  cor: string;
  giro: number;
  duracao: number;
};

function sortear(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function criarParticulas(quantidade: number): Particula[] {
  return Array.from({ length: quantidade }, (_, i) => ({
    angulo: (i / quantidade) * Math.PI * 2 + sortear(-0.3, 0.3),
    distancia: sortear(70, 150),
    tamanho: sortear(4, 9),
    formato: FORMATOS[i % FORMATOS.length],
    cor: CORES[i % CORES.length],
    giro: sortear(-360, 360),
    duracao: sortear(900, 1300),
  }));
}

function estiloDaParticula(p: Particula, progresso: Animated.Value) {
  const destinoX = Math.cos(p.angulo) * p.distancia;
  const destinoY = Math.sin(p.angulo) * p.distancia;
  return {
    opacity: progresso.interpolate({ inputRange: [0, 0.1, 0.7, 1], outputRange: [0, 1, 1, 0] }),
    transform: [
      { translateX: progresso.interpolate({ inputRange: [0, 1], outputRange: [0, destinoX] }) },
      // sobe até o destino e depois cai um pouco (a "gravidade")
      { translateY: progresso.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, destinoY, destinoY + 40] }) },
      { scale: progresso.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0.3, 1, 0.6] }) },
      { rotate: progresso.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${p.giro}deg`] }) },
    ],
  };
}

type FogosProps = {
  explosoes?: number; // quantas explosões seguidas
  atraso?: number; // ms antes da primeira
  topo?: number; // altura (a partir do topo do pai) de onde os fogos saem
};

export default function Fogos({ explosoes = 3, atraso = 300, topo = 46 }: FogosProps) {
  const grupos = useMemo(() => Array.from({ length: explosoes }, () => criarParticulas(18)), [explosoes]);
  const valores = useRef(grupos.map((grupo) => grupo.map(() => new Animated.Value(0)))).current;

  useEffect(() => {
    if (movimentoReduzido()) return; // quem pediu menos movimento não vê os fogos

    const explosao = (grupo: Animated.Value[], g: number) =>
      Animated.parallel(
        grupo.map((valor, i) =>
          Animated.timing(valor, {
            toValue: 1,
            duration: grupos[g][i].duracao,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ),
      );

    const animacao = Animated.sequence([Animated.delay(atraso), Animated.stagger(350, valores.map(explosao))]);
    animacao.start();
    return () => animacao.stop(); // a tela fechou no meio: para tudo
  }, [valores, grupos, atraso]);

  return (
    // pointerEvents="none": os fogos ficam por cima, mas os toques passam para a tela
    <View pointerEvents="none" style={[styles.palco, { top: topo }]}>
      {grupos.map((grupo, g) =>
        grupo.map((p, i) => (
          <Animated.View
            key={`${g}-${i}`}
            style={[
              styles.particula,
              {
                width: p.formato === 'traco' ? p.tamanho * 2.5 : p.tamanho,
                height: p.tamanho,
                borderRadius: p.formato === 'ponto' ? p.tamanho / 2 : 1,
                backgroundColor: p.cor,
              },
              estiloDaParticula(p, valores[g][i]),
            ]}
          />
        )),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ponto zero-por-zero no centro: as partículas saem dele
  palco: { position: 'absolute', left: '50%', width: 0, height: 0 },
  particula: { position: 'absolute' },
});
