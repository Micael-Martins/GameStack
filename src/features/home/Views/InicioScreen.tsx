import { StyleSheet, Text, View } from 'react-native';
import { cores, tipografia } from '../../../theme';

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Início</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, justifyContent: 'center', alignItems: 'center' },
  titulo: { color: cores.texto, fontFamily: tipografia.fonte, fontSize: tipografia.tamanhos.titulo },
});
