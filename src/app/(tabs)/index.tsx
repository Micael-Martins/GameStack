import { StyleSheet, Text, View } from 'react-native';
import { cores, tipografia } from '../../theme';

export default function InicioScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tema Aplicado!</Text>
      <Text style={styles.texto}>A fonte Plus Jakarta Sans e as cores escuras estão a funcionar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo, 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    color: cores.texto, 
    fontFamily: tipografia.fonte, 
    fontSize: tipografia.tamanhos.titulo,
    fontWeight: tipografia.pesos.bold,
    marginBottom: 10,
  },
  texto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fonte,
    fontSize: tipografia.tamanhos.corpo,
    textAlign: 'center',
  }
});