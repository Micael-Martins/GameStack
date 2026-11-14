import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { cores, tipografia } from '../../theme';

type CampoTextoProps = TextInputProps & { label?: string; sufixo?: string };

export default function CampoTexto({ label, sufixo, style, onFocus, onBlur, multiline, accessibilityLabel, ...props }: CampoTextoProps) {
  const [focado, setFocado] = useState(false);

  return (
    <View style={styles.grupo}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.campo, focado && styles.focado]}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { gap: 8 },
  label: { color: cores.texto, fontFamily: tipografia.fonte, fontSize: 13 },
  campo: { flexDirection: 'row', alignItems: 'center', backgroundColor: cores.card, borderWidth: 1, borderColor: cores.borda, borderRadius: 12, paddingHorizontal: 12 },
  focado: { borderColor: cores.texto },
  input: { flex: 1, minWidth: 0, minHeight: 48, paddingVertical: 12, color: cores.texto, fontFamily: tipografia.fonte, fontSize: 15 },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  sufixo: { color: cores.textoSecundario, fontFamily: tipografia.fonte, marginLeft: 8 },
});
