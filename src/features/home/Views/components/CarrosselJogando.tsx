import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import { PrimaryButton } from '../../../../components/PrimaryButton';
import TituloSecao from '../../../../components/TituloSecao';
import type { JogoBiblioteca } from '../../../../models/JogoBiblioteca';
import { cores, tipografia } from '../../../../theme';
import { CardDestaque, estiloCardDestaque } from './CardDestaque';

type Props = {
  jogos: JogoBiblioteca[];
  onRegistrarHoras: (item: JogoBiblioteca) => void;
  onAbrirJogo: (item: JogoBiblioteca) => void;
  onAbrirBiblioteca: () => void;
};

const MARGEM_TELA = 20; // padding lateral da Home
const ESPIADA = 34; // pedaço do próximo card que fica aparecendo
const ESPACO = 10;

// "Jogando agora": um card por jogo em andamento, passando para o lado.
export function CarrosselJogando({ jogos, onRegistrarHoras, onAbrirJogo, onAbrirBiblioteca }: Props) {
  const { width } = useWindowDimensions();
  const [pagina, setPagina] = useState(0);

  if (jogos.length === 0) {
    return (
      <View>
        <TituloSecao titulo="Jogando agora" />
        <View style={[estiloCardDestaque, styles.cardVazio]}>
          <Text style={styles.textoVazio}>Nenhum jogo em andamento. Escolha um da sua fila para começar.</Text>
          <PrimaryButton title="Ver minha fila" onPress={onAbrirBiblioteca} />
        </View>
      </View>
    );
  }

  const umSo = jogos.length === 1;
  const larguraCard = width - MARGEM_TELA * 2 - (umSo ? 0 : ESPIADA);
  const passo = larguraCard + ESPACO;

  // Descobre em qual card o carrossel parou, para acender o pontinho certo.
  function aoTerminarRolagem(evento: NativeSyntheticEvent<NativeScrollEvent>) {
    setPagina(Math.round(evento.nativeEvent.contentOffset.x / passo));
  }

  return (
    <View>
      <View style={styles.cabecalho}>
        <TituloSecao titulo="Jogando agora" />
        {!umSo && <Text style={styles.contador}>{jogos.length} jogos</Text>}
      </View>

      <FlatList
        data={jogos}
        keyExtractor={(item) => item.id}
        horizontal
        scrollEnabled={!umSo}
        showsHorizontalScrollIndicator={false}
        snapToInterval={passo}
        decelerationRate="fast"
        onMomentumScrollEnd={aoTerminarRolagem}
        style={umSo ? undefined : styles.lista}
        contentContainerStyle={styles.conteudoLista}
        renderItem={({ item }) => (
          <CardDestaque
            item={item}
            largura={larguraCard}
            onRegistrarHoras={() => onRegistrarHoras(item)}
            onAbrir={() => onAbrirJogo(item)}
          />
        )}
      />

      {!umSo && (
        <View style={styles.pontos} accessibilityLabel={`Jogo ${pagina + 1} de ${jogos.length}`}>
          {jogos.map((item, indice) => (
            <View key={item.id} style={[styles.ponto, indice === pagina && styles.pontoAtivo]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  contador: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  lista: { marginRight: -MARGEM_TELA }, // os cards vão até a borda da tela
  conteudoLista: { gap: ESPACO, paddingRight: MARGEM_TELA },
  cardVazio: { gap: 14 },
  textoVazio: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14, lineHeight: 21 },
  pontos: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  ponto: { width: 6, height: 6, borderRadius: 3, backgroundColor: cores.bordaForte },
  pontoAtivo: { width: 18, backgroundColor: cores.texto },
});
