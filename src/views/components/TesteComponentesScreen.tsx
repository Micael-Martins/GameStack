import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { StatusJogo } from '../../models/StatusJogo';
import { cores, espacamentos } from '../../theme';
import ChipFiltro from './ChipFiltro';
import StatusChip from './StatusChip';

const status: StatusJogo[] = [
  'NA_FILA',
  'JOGANDO',
  'CONCLUIDO',
  'ABANDONADO',
];

const filtros = [
  { texto: 'Todos' },
  { texto: 'Na fila'},
  { texto: 'Jogando'},
  { texto: 'Concluídos'},
  { texto: 'Abandonados'},
];

export default function TesteComponentesScreen() {
  const [filtroSelecionado, setFiltroSelecionado] =
    useState('Todos');

  const [fontesCarregadas] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontesCarregadas) {
    return null;
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.titulo}>GameStack</Text>

      <Text style={styles.subtitulo}>
        Demonstração dos componentes
      </Text>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>
          Status dos jogos
        </Text>

        <View style={styles.linha}>
          {status.map((item) => (
            <StatusChip key={item} status={item} />
          ))}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>
          Filtros da biblioteca
        </Text>

        <View style={styles.linha}>
          {filtros.map((item) => (
  <ChipFiltro
    key={item.texto}
    texto={item.texto}
    selecionado={filtroSelecionado === item.texto}
    onPress={() => setFiltroSelecionado(item.texto)}
  />
))}
        </View>

        <Text style={styles.resultado}>
          Selecionado: {filtroSelecionado}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },

  conteudo: {
    padding: espacamentos.gg,
    paddingTop: 48,
    paddingBottom: 60,
    gap: 24,
  },

  titulo: {
    color: cores.texto,
    fontFamily: 'PlusJakartaSans_800ExtraBold',
    fontSize: 30,
  },

  subtitulo: {
    color: cores.textoSecundario,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 15,
  },

  secao: {
    backgroundColor: cores.card,
    padding: 16,
    borderRadius: espacamentos.raios.cards,
    gap: 14,
  },

  tituloSecao: {
    color: cores.texto,
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 18,
  },

  linha: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  resultado: {
    color: cores.textoSecundario,
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    marginTop: 8,
  },
});
