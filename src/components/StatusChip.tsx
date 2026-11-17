import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { StatusJogo } from '../models/StatusJogo';
import { bordas, cores, tipografia } from '../theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

interface StatusChipProps {
  status: StatusJogo;
  grande?: boolean; // versão maior, para o card de status da tela Detalhes
}

// Texto e ícone de cada status. Como o app é preto e branco, os status se
// diferenciam pela forma (ícone, fundo cheio, borda tracejada), não pela cor.
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

// Etiqueta com o status do jogo (NA FILA, JOGANDO, CONCLUÍDO, ABANDONADO).
export default function StatusChip({ status, grande = false }: StatusChipProps) {
  const { rotulo, icone, tamanho } = configuracoes[status];
  const concluido = status === 'CONCLUIDO';

  // Concluído tem fundo branco, então o texto fica escuro
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
        grande && styles.baseGrande,
      ]}
    >
      <Ionicons
        name={icone}
        size={grande ? tamanho + 2 : tamanho}
        color={corConteudo}
      />

      <Text style={[styles.rotulo, grande && styles.rotuloGrande, { color: corConteudo }]}>
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
    borderRadius: bordas.raios.chips,
    borderWidth: bordas.fina,
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
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 12,
    letterSpacing: 0.4,
  },

  baseGrande: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  rotuloGrande: {
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 13,
    letterSpacing: 0.8,
  },
});