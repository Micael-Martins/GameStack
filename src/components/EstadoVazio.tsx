import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { bordas, cores, tipografia } from '../theme';
import { PrimaryButton } from './PrimaryButton';

type EstadoVazioProps = {
  titulo: string;
  descricao?: string;
  icone?: ComponentProps<typeof Ionicons>['name'];
  acao?: { titulo: string; onPress: () => void };
  style?: StyleProp<ViewStyle>;
};

// Caixa tracejada usada quando não há nada para mostrar (Pesquisa, resultados vazios, erro).
export default function EstadoVazio({
  titulo,
  descricao,
  icone = 'game-controller-outline',
  acao,
  style,
}: EstadoVazioProps) {
  return (
    <View style={[styles.caixa, style]}>
      <View style={styles.icone} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Ionicons name={icone} size={30} color={cores.texto} />
      </View>
      <Text accessibilityRole="header" style={styles.titulo}>
        {titulo}
      </Text>
      {descricao ? <Text style={styles.descricao}>{descricao}</Text> : null}
      {acao ? <PrimaryButton title={acao.titulo} onPress={acao.onPress} style={styles.acao} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  caixa: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderStyle: 'dashed',
    borderColor: cores.bordaForte,
  },
  icone: {
    width: 64,
    height: 64,
    borderRadius: bordas.raios.cards,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  titulo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 20,
    lineHeight: 26,
    textAlign: 'center',
  },
  descricao: {
    marginTop: 10,
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  acao: { marginTop: 22, alignSelf: 'stretch' },
});
