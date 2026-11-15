import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores, tipografia } from '../../../../theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type Props = {
  completed: number;
  playing: number;
  queued: number;
  hours: number;
  dimmed?: boolean; 
};

export function SummaryStrip({ completed, playing, queued, hours, dimmed = false }: Props) {
  const items: { icon: IconName; value: number; label: string; flex: number }[] = [
    { icon: 'trophy-outline', value: completed, label: 'zerados', flex: 1 },
    { icon: 'play-circle-outline', value: playing, label: 'em andamento', flex: 1.5 },
    { icon: 'layers-outline', value: queued, label: 'na fila', flex: 1 },
    { icon: 'time-outline', value: hours, label: 'horas', flex: 1 },
  ];

  return (
    <View
      style={styles.strip}
      accessible
      accessibilityLabel={`Resumo: ${completed} zerados, ${playing} em andamento, ${queued} na fila, ${hours} horas`}
    >
      {items.map((item, index) => (
        <View key={item.label} style={[styles.item, { flex: item.flex }, index > 0 && styles.divider]}>
          <View style={styles.top}>
            <Ionicons name={item.icon} size={15} color={dimmed ? DIMMED : cores.textoFraco} />
            <Text style={[styles.value, dimmed && styles.dimmed]}>{item.value}</Text>
          </View>
          <Text style={[styles.label, dimmed && styles.dimmed]} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const DIMMED = '#4A4A4A';

const styles = StyleSheet.create({
  strip: { flexDirection: 'row', gap: 10 },
  item: { minWidth: 0, gap: 4 },
  divider: { borderLeftWidth: 1, borderLeftColor: cores.borda, paddingLeft: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  value: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 21, letterSpacing: -0.5 },
  label: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },
  dimmed: { color: DIMMED },
});