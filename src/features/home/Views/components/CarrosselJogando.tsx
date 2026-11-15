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
import { NowPlayingCard, nowPlayingCardStyle } from './CardDestaque';

type Props = {
  games: JogoBiblioteca[];
  onLogHours: (game: JogoBiblioteca) => void;
  onOpenGame: (game: JogoBiblioteca) => void;
  onOpenLibrary: () => void;
};

const SCREEN_PADDING = 20; // padding lateral da Home
const PEEK = 34; // pedaço do próximo card que fica aparecendo
const GAP = 10;

export function NowPlayingCarousel({ games, onLogHours, onOpenGame, onOpenLibrary }: Props) {  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);

  if (games.length === 0) {
    return (
      <View>
        <TituloSecao titulo="Jogando agora" />
        <View style={[nowPlayingCardStyle, styles.emptyCard]}>
          <Text style={styles.emptyText}>Nenhum jogo em andamento. Escolha um da sua fila para começar.</Text>
          <PrimaryButton title="Ver minha fila" onPress={onOpenLibrary} />
        </View>
      </View>
    );
  }

  const single = games.length === 1;
  const cardWidth = width - SCREEN_PADDING * 2 - (single ? 0 : PEEK);
  const step = cardWidth + GAP;

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    setPage(Math.round(event.nativeEvent.contentOffset.x / step));
  }

  return (
    <View>
      <View style={styles.header}>
        <TituloSecao titulo="Jogando agora" />
        {!single && <Text style={styles.count}>{games.length} jogos</Text>}
      </View>

      <FlatList
        data={games}
        keyExtractor={(game) => game.id}
        horizontal
        scrollEnabled={!single}
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        onMomentumScrollEnd={onScrollEnd}
        style={single ? undefined : styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <NowPlayingCard game={item} width={cardWidth} onLogHours={() => onLogHours(item)} onOpen={() => onOpenGame(item)} />
        )}
                      />

      {!single && (
        <View style={styles.dots} accessibilityLabel={`Jogo ${page + 1} de ${games.length}`}>
          {games.map((game, index) => (
            <View key={game.id} style={[styles.dot, index === page && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  count: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  list: { marginRight: -SCREEN_PADDING }, // os cards vão até a borda da tela
  listContent: { gap: GAP, paddingRight: SCREEN_PADDING },
  emptyCard: { gap: 14 },
  emptyText: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14, lineHeight: 21 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#3A3A3A' },
  dotActive: { width: 18, backgroundColor: cores.texto },
});