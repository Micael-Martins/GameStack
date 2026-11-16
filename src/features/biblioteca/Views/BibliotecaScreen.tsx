import { Ionicons } from '@expo/vector-icons';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CardJogo from '../../../components/CardJogo';
import ChipFiltro from '../../../components/ChipFiltro';
import EstadoVazio from '../../../components/EstadoVazio';
import EstadoCarregando from '../../../components/EstadoCarregando';
import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { RootStackParamList, TabParamList } from '../../../navigation/tipos';
import { cores, estilosGlobais } from '../../../theme';
import { FILTROS } from '../Model/filtrosBiblioteca';
import { useBibliotecaViewModel } from '../ViewModel/useBibliotecaViewModel';
import { styles } from './styles/BibliotecaScreen.styles';
// Aba das abas (Biblioteca) que também abre telas da pilha principal (Detalhes).
type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Biblioteca'>,
  NativeStackScreenProps<RootStackParamList>
>;

// Tela 06 do protótipo: todos os jogos, com filtros por status.
export default function BibliotecaScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useBibliotecaViewModel(route.params?.filtro);

  const irParaPesquisa = () => navigation.navigate('Pesquisar');
  const abrirDetalhes = (item: JogoBiblioteca) => navigation.navigate('DetalhesJogo', { id: item.id });

  // Depois de aplicar o filtro que veio de outra tela, limpa o parâmetro:
  // assim o próximo "Ver minha fila" funciona de novo, mesmo se a pessoa trocou de chip.
  const filtroRecebido = route.params?.filtro;
  useEffect(() => {
    if (filtroRecebido) navigation.setParams({ filtro: undefined });
  }, [filtroRecebido, navigation]);

  const rotuloFiltro = FILTROS.find((item) => item.filtro === vm.filtro)?.rotulo ?? '';

  return (
    <View style={[estilosGlobais.tela, { paddingTop: insets.top + 16 }]}>
      {/* Topo: título, resumo e "+" */}
      <View style={styles.topo}>
        <View style={styles.textosTopo}>
          <Text accessibilityRole="header" style={styles.titulo}>
            Minha biblioteca
          </Text>
          <Text style={styles.resumo}>{vm.resumo}</Text>
        </View>
        <Pressable
          onPress={irParaPesquisa}
          accessibilityRole="button"
          accessibilityLabel="Adicionar jogo"
          style={({ pressed }) => [styles.botaoAdicionar, pressed && estilosGlobais.pressionado]}
        >
          <Ionicons name="add" size={28} color={cores.fundo} />
        </Pressable>
      </View>

            {vm.estado === 'CARREGANDO' ? (
        <View style={styles.centro}>
          <EstadoCarregando mensagem="Abrindo sua biblioteca..." />
        </View>
      ) : vm.estado === 'ERRO' ? (
        <View style={styles.centro}>
          <EstadoVazio
            titulo="Não foi possível abrir a biblioteca"
            descricao={vm.erro ?? 'Tente novamente em instantes.'}
            icone="alert-circle-outline"
            acao={{ titulo: 'Tentar novamente', onPress: vm.tentarNovamente }}
          />
        </View>
      ) : vm.estado === 'VAZIA' ? (
        <View style={styles.centro}>
          <EstadoVazio
            titulo="Adicione seu primeiro jogo"
            descricao="Pesquise os jogos que você já tem e ainda não terminou."
            acao={{ titulo: 'Pesquisar jogos', onPress: irParaPesquisa }}
          />
        </View>
      ) : (
        <>
          {/* Filtros com rolagem para o lado */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtros}
            contentContainerStyle={styles.conteudoFiltros}
          >
            {FILTROS.map((item) => (
              <ChipFiltro
                key={item.filtro}
                texto={item.rotulo}
                quantidade={vm.contagem[item.filtro]}
                selecionado={vm.filtro === item.filtro}
                onPress={() => vm.trocarFiltro(item.filtro)}
              />
            ))}
          </ScrollView>

          <View style={styles.linhaInfo}>
            <Text style={styles.textoOrdem}>POR ÚLTIMA SESSÃO</Text>
            <Text style={styles.textoMostrando}>
              Mostrando {vm.jogosFiltrados.length} de {vm.total}
            </Text>
          </View>

          <FlatList
            data={vm.jogosFiltrados}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CardJogo item={item} onPress={abrirDetalhes} />}
            ItemSeparatorComponent={() => <View style={styles.separador} />}
            contentContainerStyle={styles.lista}
            ListEmptyComponent={
              <EstadoVazio
                titulo={`Nenhum jogo em "${rotuloFiltro}"`}
                descricao="Troque o filtro ou mude o status de algum jogo."
                icone="filter-outline"
                acao={{ titulo: 'Ver todos', onPress: () => vm.trocarFiltro('TODOS') }}
              />
            }
          />
        </>
      )}
    </View>
  );
}