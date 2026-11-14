import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espacamentos } from '../../theme';

type NomeIcone = ComponentProps<typeof Ionicons>['name'];

export interface ChipFiltroProps {
  texto: string;
  selecionado: boolean;
  onPress: () => void;
  quantidade?: number;
  icone?: NomeIcone;
  desabilitado?: boolean;
}

export default function ChipFiltro({
  texto,
  selecionado,
  onPress,
  quantidade,
  icone,
  desabilitado = false,
}: ChipFiltroProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={desabilitado}
      accessibilityRole="button"
      accessibilityLabel={`Filtro: ${texto}`}
      accessibilityState={{
        selected: selecionado,
        disabled: desabilitado,
      }}
      style={({ pressed }) => [
        styles.base,
        selecionado && styles.selecionado,
        pressed && !desabilitado && styles.pressionado,
        desabilitado && styles.desabilitado,
      ]}
    >
      {icone && (
        <Ionicons
          name={icone}
          size={15}
          color={cores.textoSecundario}
        />
      )}

      <Text style={styles.rotulo}>{texto}</Text>

      {quantidade !== undefined && (
        <Text style={styles.quantidade}>
          {quantidade}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: espacamentos.raios.chips,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },

  selecionado: {
    borderColor: cores.textoSecundario,
    backgroundColor: cores.borda,
  },

  pressionado: {
    opacity: 0.75,
  },

  desabilitado: {
    opacity: 0.4,
  },

  rotulo: {
    color: cores.texto,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 13,
  },

  quantidade: {
    color: cores.textoSecundario,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 12,
  },
});
