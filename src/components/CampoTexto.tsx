import { Ionicons } from '@expo/vector-icons';
import { ComponentProps, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { bordas, cores, tipografia } from '../theme';

// Campo de texto do app: rótulo, ícone, sufixo ("horas") e botão de limpar opcionais.
type CampoTextoProps = TextInputProps & {
  label?: string;
  sufixo?: string;
  icone?: ComponentProps<typeof Ionicons>['name']; // ex.: lupa da Pesquisa
  onLimpar?: () => void; // mostra um X para limpar quando há texto
  destacado?: boolean; // borda branca mesmo sem foco (campo preenchido)
};

export default function CampoTexto({
  label,
  sufixo,
  icone,
  onLimpar,
  destacado = false,
  style,
  onFocus,
  onBlur,
  multiline,
  accessibilityLabel,
  ...props
}: CampoTextoProps) {
  const [focado, setFocado] = useState(false); // borda branca enquanto digita

  return (
    <View style={styles.grupo}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.campo, (focado || destacado) && styles.focado]}>
        {icone ? <Ionicons name={icone} size={20} color={cores.textoSecundario} style={styles.icone} /> : null}
        <TextInput
          {...props}
          accessibilityLabel={accessibilityLabel ?? label}
          multiline={multiline}
          placeholderTextColor={cores.textoFraco}
          underlineColorAndroid="transparent"
          style={[styles.input, multiline && styles.multiline, style]}
          onFocus={(evento) => { setFocado(true); onFocus?.(evento); }}
          onBlur={(evento) => { setFocado(false); onBlur?.(evento); }}
        />
        {sufixo ? <Text style={styles.sufixo}>{sufixo}</Text> : null}
        {onLimpar && props.value ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Limpar" onPress={onLimpar} hitSlop={8} style={styles.limpar}>
            <Ionicons name="close" size={20} color={cores.textoSecundario} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: 8 },
  label: { color: cores.textoClaro, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  campo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.card,
    borderWidth: bordas.fina,
    borderColor: cores.bordaCampo,
    borderRadius: bordas.raios.campos,
    paddingHorizontal: 16,
  },
  focado: { borderColor: cores.texto },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 52,
    paddingVertical: 14,
    color: cores.texto,
    fontFamily: tipografia.fontes.regular,
    fontSize: 16,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  sufixo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, marginLeft: 8 },
  icone: { marginRight: 10 },
  limpar: { minWidth: 32, minHeight: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
});