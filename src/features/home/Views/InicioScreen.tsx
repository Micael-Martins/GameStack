import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from '../../../navigation/tipos';
import { cores, tipografia } from '../../../theme';

export default function InicioScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Engrenagem que abre as Configurações (manter na Home definitiva). */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Configurações"
        onPress={() => navigation.navigate('Configuracoes')}
        style={styles.engrenagem}
      >
        <Ionicons name="settings-outline" size={22} color={cores.texto} />
      </Pressable>
      <Text style={styles.titulo}>Início</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, justifyContent: 'center', alignItems: 'center' },
  titulo: { color: cores.texto, fontFamily: tipografia.fonte, fontSize: tipografia.tamanhos.titulo },
  engrenagem: {
    position: 'absolute',
    top: 56,
    right: 20,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
