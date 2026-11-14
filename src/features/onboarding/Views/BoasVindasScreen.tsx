import { View, Text, StyleSheet } from 'react-native';
import { cores, tipografia } from '../../../theme';

export default function BoasVindasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Boas-Vindas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, justifyContent: 'center', alignItems: 'center' },
  titulo: { color: cores.texto, fontFamily: tipografia.fonte, fontSize: tipografia.tamanhos.titulo }
});