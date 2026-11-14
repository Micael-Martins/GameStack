import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { StatusJogo } from '../../models/StatusJogo';
import { cores, espacamentos } from '../../theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

interface StatusChipProps {
  status: StatusJogo;
}

const configuracoes: Record<
  StatusJogo,
  { rotulo: string; icone: NomeIcone; tamanho: number }
> = {
  NA_FILA: {
    rotulo: 'NA FILA',
    icone: 'time-outline',
    tamanho: 13,
  },
  JOGANDO: {
    rotulo: 'JOGANDO',
    icone: 'ellipse',
    tamanho: 7,
  },
  CONCLUIDO: {
    rotulo: 'CONCLUÍDO',
    icone: 'checkmark',
    tamanho: 14,
  },
  ABANDONADO: {
    rotulo: 'ABANDONADO',
    icone: 'close',
    tamanho: 14,
  },
};

export default function StatusChip({ status }: StatusChipProps) {
  const { rotulo, icone, tamanho } = configuracoes[status];
  const concluido = status === 'CONCLUIDO';

  const corConteudo = concluido
    ? cores.fundo
    : status === 'ABANDONADO'
      ? cores.textoSecundario
      : cores.texto;

  return (
    <View
      accessible
      accessibilityLabel={`Status: ${rotulo}`}
      style={[
        styles.base,
        styles[status],
      ]}
    >
      <Ionicons
        name={icone}
        size={tamanho}
        color={corConteudo}
      />

      <Text style={[styles.rotulo, { color: corConteudo }]}>
        {rotulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: espacamentos.raios.chips,
    borderWidth: 1,
  },

  NA_FILA: {
    backgroundColor: cores.fundo,
    borderColor: cores.textoSecundario,
  },

  JOGANDO: {
    backgroundColor: cores.borda,
    borderColor: cores.borda,
  },

  CONCLUIDO: {
    backgroundColor: cores.texto,
    borderColor: cores.texto,
  },

  ABANDONADO: {
    backgroundColor: 'transparent',
    borderColor: cores.textoFraco,
    borderStyle: 'dashed',
  },

  rotulo: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
