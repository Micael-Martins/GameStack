import { StyleSheet, View } from 'react-native';

import { cores, espacamentos } from '../../theme';

export type BarraProgressoProps = {
  /** Fração já calculada: minutos jogados / tempo médio convertido para minutos. */
  valor: number;
  temTempoMedio: boolean;
  variante?: 'normal' | 'fina';
  descricao?: string;
};

/** A conversão de unidades pertence ao ViewModel; a barra cuida apenas da exibição. */
export default function BarraProgresso({
  valor,
  temTempoMedio,
  variante = 'normal',
  descricao = 'Progresso do jogo',
}: BarraProgressoProps) {
  if (!temTempoMedio) return null;

  const fracao = Number.isFinite(valor) ? Math.min(1, Math.max(0, valor)) : 0;
  const percentual = Math.round(fracao * 100);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={descricao}
      accessibilityValue={{ min: 0, max: 100, now: percentual, text: `${percentual}%` }}
      style={[styles.trilho, { height: variante === 'fina' ? 5 : 8 }]}
    >
      <View style={[styles.preenchimento, { width: `${fracao * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    width: '100%',
    backgroundColor: cores.borda,
    borderRadius: espacamentos.raios.chips,
    overflow: 'hidden',
  },
  preenchimento: { height: '100%', backgroundColor: cores.texto },
});
