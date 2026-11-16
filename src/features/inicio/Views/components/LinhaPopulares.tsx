import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import TituloSecao from '../../../../components/TituloSecao';
import type { Jogo } from '../../../../models/Jogo';
import { bordas, cores, estilosGlobais, tipografia } from '../../../../theme';

type Props = {
  jogos: Jogo[];
  onVerMais: () => void;
  onSelecionar: (jogo: Jogo) => void;
};

// "Populares agora": capas da RAWG, só com a biblioteca vazia.
export function LinhaPopulares({ jogos, onVerMais, onSelecionar }: Props) {
  return (
    <View>
      <TituloSecao titulo="Populares agora" link={{ texto: 'Ver mais', onPress: onVerMais }} />
      <FlatList
        data={jogos}
        keyExtractor={(jogo) => jogo.apiId}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.linha}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const genero = item.genero.split(',')[0]; // só o primeiro gênero
          return (
            <Pressable
              onPress={() => onSelecionar(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.nome}, ${genero}`}
              style={({ pressed }) => [styles.item, pressed && estilosGlobais.pressionado]}
            >
              {item.imagemURL ? (
                <Image source={{ uri: item.imagemURL }} style={styles.capa} />
              ) : (
                <View style={styles.capa} />
              )}
              <Text style={styles.nome} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.genero} numberOfLines={1}>
                {genero}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { marginRight: -20 }, // as capas vão até a borda da tela
  lista: { gap: 12, paddingRight: 20 },
  item: { width: 92, gap: 4 },
  capa: {
    width: 92,
    height: 122,
    borderRadius: bordas.raios.pequeno,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.borda,
  },
  nome: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 13, marginTop: 2 },
  genero: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 11 },
});
