import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, FlatList, ScrollView, Text, View } from 'react-native';

import CampoTexto from '../../../components/CampoTexto';
import CardJogo from '../../../components/CardJogo';
import ChipFiltro from '../../../components/ChipFiltro';
import EstadoVazio from '../../../components/EstadoVazio';
import type { RootStackParamList, TabParamList } from '../../../navigation/tipos';
import type { StatusJogo } from '../../../models/StatusJogo';
import { cores } from '../../../theme';
import type { FiltroBiblioteca } from '../Model/filtrosBiblioteca';
import { useBibliotecaViewModel } from '../ViewModel/useBibliotecaViewModel';
import { styles } from './BibliotecaScreen.styles';

type Props = BottomTabScreenProps<TabParamList, 'Biblioteca'>;

const filtros: { id: FiltroBiblioteca; rotulo: string; status?: StatusJogo }[] = [
  { id: 'TODOS', rotulo: 'Todos' },
  { id: 'JOGANDO', rotulo: 'Jogando', status: 'JOGANDO' },
  { id: 'NA_FILA', rotulo: 'Na fila', status: 'NA_FILA' },
  { id: 'CONCLUIDO', rotulo: 'Concluídos', status: 'CONCLUIDO' },
  { id: 'ABANDONADO', rotulo: 'Abandonados', status: 'ABANDONADO' },
];

export default function BibliotecaScreen({ navigation }: Props) {
  const vm = useBibliotecaViewModel();
  const navigationRaiz = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const abrirDetalhes = (id: string) => navigationRaiz?.navigate('DetalhesJogo', { id });

  const cabecalho = (
    <View style={styles.cabecalho}>
      <Text accessibilityRole="header" style={styles.titulo}>Biblioteca</Text>
      <Text style={styles.subtitulo}>
        {vm.jogos.length === 1 ? '1 jogo salvo' : `${vm.jogos.length} jogos salvos`}
      </Text>
      <View style={styles.busca}>
        <CampoTexto
          icone="search-outline"
          placeholder="Buscar na biblioteca"
          value={vm.termo}
          onChangeText={vm.setTermo}
          onLimpar={() => vm.setTermo('')}
          returnKeyType="search"
          accessibilityLabel="Buscar jogos na biblioteca"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
        {filtros.map(({ id, rotulo, status }) => (
          <ChipFiltro
            key={id}
            texto={rotulo}
            selecionado={vm.filtro === id}
            quantidade={status ? vm.quantidadePorStatus(status) : vm.jogos.length}
            onPress={() => vm.selecionarFiltro(id)}
          />
        ))}
      </ScrollView>
      {vm.erro ? (
        <View style={styles.avisoErro}>
          <Text style={styles.textoErro}>{vm.erro}</Text>
          <Text accessibilityRole="button" onPress={() => void vm.tentarNovamente()} style={styles.acaoErro}>
            Tentar novamente
          </Text>
        </View>
      ) : null}
    </View>
  );

  let vazio = null;
  if (vm.carregando && vm.jogos.length === 0) {
    vazio = <ActivityIndicator color={cores.texto} size="large" style={styles.indicador} />;
  } else if (vm.jogos.length === 0 && !vm.erro) {
    vazio = (
      <EstadoVazio
        titulo="Sua biblioteca está vazia"
        descricao="Pesquise jogos e adicione os que quer acompanhar."
        icone="library-outline"
        acao={{ titulo: 'Pesquisar jogos', onPress: () => navigation.navigate('Pesquisar') }}
      />
    );
  } else if (vm.jogosVisiveis.length === 0) {
    vazio = (
      <EstadoVazio
        titulo="Nenhum jogo encontrado"
        descricao="Tente mudar o filtro ou o termo da busca."
        icone="search-outline"
      />
    );
  } else if (vm.jogos.length === 0 && vm.erro) {
    vazio = <EstadoVazio titulo="Não foi possível carregar os jogos" descricao={vm.erro} acao={{ titulo: 'Tentar novamente', onPress: () => void vm.tentarNovamente() }} />;
  }

  return (
    <View style={styles.tela}>
      <FlatList
        data={vm.jogosVisiveis}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardJogo item={item} onPress={() => abrirDetalhes(item.id)} />}
        ListHeaderComponent={cabecalho}
        ListEmptyComponent={vazio}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        contentContainerStyle={[styles.lista, vm.jogosVisiveis.length === 0 && styles.estado]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
