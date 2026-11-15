import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../../../components/PrimaryButton';
import TituloSecao from '../../../components/TituloSecao';
import type { Jogo } from '../../../models/Jogo';
import type { TabParamList } from '../../../navigation/tipos';
import { cores } from '../../../theme';
import { useHomeViewModel } from '../ViewModel/useHomeViewModel';
import { styles } from './InicioScreen.styles';

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const goToSearch = () => navigation.navigate('Pesquisar');

  const vm = useHomeViewModel();
  const { name, queueCount, stats, popularGames } = vm;
  const hasGames = !vm.isEmpty;

  // Frase do topo muda conforme a quantidade na fila
  const subtitle =
    queueCount === 0
      ? 'Sua pilha de jogos começa aqui.'
      : `Você tem ${queueCount} ${queueCount === 1 ? 'jogo esperando' : 'jogos esperando'} na fila.`;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.headerTexts}>
          <Text style={styles.greeting} numberOfLines={1}>
            Olá, {name}!
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>

        {/* Engrenagem: vai abrir Configurações (tela ainda não existe) */}
        <Pressable
          onPress={() => console.log('TODO: abrir Configurações')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={20} color="#D4D4D4" />
        </Pressable>
      </View>

      {hasGames ? null /* próximas partes: "Jogando agora" */ : <EmptyCard onSearch={goToSearch} />}

      {/* Mesma posição nas duas versões: sem jogos, os números aparecem apagados */}
      <View style={styles.stats}>
        <StatCard value={stats.completed} label="Concluídos" dimmed={!hasGames} />
        <StatCard value={stats.playing} label="Jogando" dimmed={!hasGames} />
        <StatCard value={stats.queued} label="Na fila" dimmed={!hasGames} />
        <StatCard value={`${stats.hours}h`} label="Total" dimmed={!hasGames} />
      </View>

      {/* Populares só com a biblioteca vazia; sem internet, a seção some */}
      {!hasGames && popularGames.length > 0 && (
        <PopularNow games={popularGames} onSeeMore={goToSearch} onSelect={goToSearch} />
      )}
      {/* próximas partes: "Jogados recentemente" quando hasGames */}
    </ScrollView>
  );
}

// Biblioteca vazia: convite para pesquisar o primeiro jogo
function EmptyCard({ onSearch }: { onSearch: () => void }) {
  return (
    <View style={styles.emptyCard}>
      <View style={styles.emptyArt} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.ghostCover, styles.ghostLeft]} />
        <View style={[styles.ghostCover, styles.ghostRight]} />
        <View style={styles.ghostCenter}>
          <Ionicons name="add" size={22} color={cores.textoFraco} />
        </View>
        <View style={styles.ghostRing} />
      </View>

      <View style={styles.emptyTexts}>
        <Text style={styles.emptyTitle}>Sua fila está vazia</Text>
        <Text style={styles.emptyDescription}>
          Adicione os jogos que você já tem e ainda não terminou. Comece pelo que mais tem vontade de zerar.
        </Text>
      </View>

      <PrimaryButton title="Pesquisar jogos" onPress={onSearch} style={styles.emptyButton} />
    </View>
  );
}

// Um dos 4 quadradinhos de número
function StatCard({ value, label, dimmed }: { value: number | string; label: string; dimmed: boolean }) {
  return (
    <View style={styles.statCard} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={[styles.statValue, dimmed && styles.statValueDimmed]}>{value}</Text>
      <Text style={[styles.statLabel, dimmed && styles.statLabelDimmed]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// Fileira arrastável com os jogos populares da RAWG
function PopularNow({
  games,
  onSeeMore,
  onSelect,
}: {
  games: Jogo[];
  onSeeMore: () => void;
  onSelect: (game: Jogo) => void;
}) {
  return (
    <View>
      <TituloSecao titulo="Populares agora" link={{ texto: 'Ver mais', onPress: onSeeMore }} />
      <FlatList
        data={games}
        keyExtractor={(game) => game.apiId}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.popularRow}
        contentContainerStyle={styles.popularList}
        renderItem={({ item }) => {
          // A RAWG manda vários gêneros juntos ("Action, RPG"): mostramos só o primeiro
          const genre = item.genero.split(',')[0];
          return (
            <Pressable
              onPress={() => onSelect(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.nome}, ${genre}`}
              style={({ pressed }) => [styles.popularItem, pressed && styles.pressed]}
            >
              {item.imagemURL ? (
                <Image source={{ uri: item.imagemURL }} style={styles.popularCover} />
              ) : (
                <View style={styles.popularCover} />
              )}
              <Text style={styles.popularName} numberOfLines={1}>
                {item.nome}
              </Text>
              <Text style={styles.popularGenre} numberOfLines={1}>
                {genre}
              </Text>
            </Pressable>
          );
        }}
      />
    </View>
  );
}