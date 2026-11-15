import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Jogo } from '../../../models/Jogo';
import CardJogo from '../../../components/CardJogo';
import EstadoCarregando from '../../../components/EstadoCarregando';
import EstadoVazio from '../../../components/EstadoVazio';
import TituloSecao from '../../../components/TituloSecao';
import type { RootStackParamList, TabParamList } from '../../../navigation/tipos';
import { EmptyQueueCard } from './components/CardFilaVazia';
import { NowPlayingCarousel } from './components/CarrosselJogando';
import { PopularGamesRow } from './components/LinhaPopulares';
import { SummaryStrip } from './components/FaixaResumo';
import { styles } from './InicioScreen.styles';
import { useInicioViewModel } from '../ViewModel/useInicioViewModel';
import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  // Duas navegações: a das abas (Pesquisar, Biblioteca) e a da pilha principal (Configurações)
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const rootNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const goToSearch = () => navigation.navigate('Pesquisar');
  const goToLibrary = () => navigation.navigate('Biblioteca');
  const openDetails = (game: JogoBiblioteca) => rootNavigation.navigate('DetalhesJogo', { id: game.id });
    const openAdd = (game: Jogo) => rootNavigation.navigate('AdicionarJogo', { jogo: game });
  const vm = useInicioViewModel();
  const hasGames = vm.estadoBiblioteca === 'LISTA';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}>
      <View style={styles.header}>
        <View style={styles.headerTexts}>
          <Text style={styles.greeting} numberOfLines={1}>
            Olá, {vm.name}!
          </Text>
          <Text style={styles.subtitle}>{hasGames ? 'Bom te ver de novo.' : 'Sua pilha de jogos começa aqui.'}</Text>
        </View>

        {/* Engrenagem: abre as Configurações */}
        <Pressable
          onPress={() => rootNavigation.navigate('Configuracoes')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={({ pressed }) => [styles.settingsButton, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={20} color="#D4D4D4" />
        </Pressable>
      </View>

      {/* Mesma faixa nos dois estados: sem jogos, os números aparecem apagados */}
      {(hasGames || vm.isEmpty) && (
        <View style={styles.summary}>
          {vm.carregandoDados ? (
            <EstadoCarregando mensagem="Carregando informações..." />
          ) : (
            <SummaryStrip {...vm.summary} dimmed={!hasGames} />
          )}
        </View>
      )}

      {vm.estadoBiblioteca === 'CARREGANDO' ? (
        <EstadoCarregando mensagem="Abrindo sua biblioteca..." />
      ) : vm.estadoBiblioteca === 'ERRO' ? (
        <EstadoVazio
          titulo="Não foi possível abrir a biblioteca"
          descricao={vm.erroBiblioteca ?? 'Tente novamente em instantes.'}
          icone="alert-circle-outline"
          acao={{
            titulo: 'Tentar de novo',
            onPress: vm.tentarNovamente,
          }}
        />
      ) : hasGames ? (
        <>
          <NowPlayingCarousel
            games={vm.playingGames}
            onLogHours={(game) => rootNavigation.navigate('RegistrarHoras', { id: game.id })}
            onOpenGame={openDetails}
            onOpenLibrary={() => navigation.navigate('Biblioteca', { filtro: 'NA_FILA' })}          />
          {vm.recentGames.length > 0 && (
            <View>
              <TituloSecao titulo="Jogados recentemente" link={{ texto: 'Ver todos', onPress: goToLibrary }} />
              <View style={styles.recentList}>
                {vm.recentGames.map((game) => (
                  <CardJogo key={game.id} item={game} variante="compacto" onPress={openDetails} />                ))}
              </View>
            </View>
          )}
        </>
      ) : (
        <>
          <EmptyQueueCard onSearch={goToSearch} />
          {/* Populares só com a biblioteca vazia; sem internet, a seção some */}
          {vm.carregandoPopulares && (
            <EstadoCarregando mensagem="Buscando jogos populares..." />
          )}

          {vm.popularGames.length > 0 && (
            <PopularGamesRow games={vm.popularGames} onSeeMore={goToSearch} onSelect={openAdd} />          )}
        </>
      )}
    </ScrollView>
  );
}
