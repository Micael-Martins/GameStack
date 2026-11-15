import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import TituloSecao from '../../../../components/TituloSecao';
import type { Jogo } from '../../../../models/Jogo';
import { cores, tipografia } from '../../../../theme';

type Props = {
  games: Jogo[];
  onSeeMore: () => void;
  onSelect: (game: Jogo) => void;
};

export function PopularGamesRow({ games, onSeeMore, onSelect }: Props) {
  return (
    <View>
      <TituloSecao titulo="Populares agora" link={{ texto: 'Ver mais', onPress: onSeeMore }} />
      <FlatList
        data={games}
        keyExtractor={(game) => game.apiId}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const genre = item.genero.split(',')[0];
          return (
            <Pressable
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.nome}, ${genre}`}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              {item.imagemURL ? (
                <Image source={{ uri: item.imagemURL }} style={styles.cover} />
              ) : (
                <View style={styles.cover} />
              )}
              <Text style={styles.name} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.genre} numberOfLines={1}>
                {genre}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginRight: -20 }, 
  list: { gap: 12, paddingRight: 20 },
  item: { width: 92, gap: 4 },
  pressed: { opacity: 0.7 },
  cover: {
    width: 92,
    height: 122,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.borda,
  },
  name: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 13, marginTop: 2 },
  genre: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 11 },
});