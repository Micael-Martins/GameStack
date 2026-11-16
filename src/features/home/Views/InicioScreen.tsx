import { Ionicons } from '@expo/vector-icons';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CardJogo from '../../../components/CardJogo';
import EstadoCarregando from '../../../components/EstadoCarregando';
import EstadoVazio from '../../../components/EstadoVazio';
import TituloSecao from '../../../components/TituloSecao';
import type { Jogo } from '../../../models/Jogo';
import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import type { RootStackParamList, TabParamList } from '../../../navigation/tipos';
import { cores, estilosGlobais } from '../../../theme';
import { useInicioViewModel } from '../ViewModel/useInicioViewModel';
import { CardFilaVazia } from './components/CardFilaVazia';
import { CarrosselJogando } from './components/CarrosselJogando';
import { FaixaResumo } from './components/FaixaResumo';
import { LinhaPopulares } from './components/LinhaPopulares';
import { styles } from './styles/InicioScreen.styles';

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  // Duas navegações: a das abas (Pesquisar, Biblioteca) e a da pilha principal (Configurações, Detalhes...)
  const navegacaoAbas = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const navegacaoPrincipal = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const irParaPesquisa = () => navegacaoAbas.navigate('Pesquisar');
  const irParaBiblioteca = () => navegacaoAbas.navigate('Biblioteca');
  const abrirDetalhes = (item: JogoBiblioteca) => navegacaoPrincipal.navigate('DetalhesJogo', { id: item.id });
  const abrirAdicionar = (jogo: Jogo) => navegacaoPrincipal.navigate('AdicionarJogo', { jogo });

  const vm = useInicioViewModel();
  const temJogos = vm.estadoBiblioteca === 'LISTA';

  return (
    <ScrollView style={estilosGlobais.tela} contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topo}>
        <View style={styles.textosTopo}>
          <Text style={styles.saudacao} numberOfLines={1}>
            Olá, {vm.nome}!
          </Text>
          <Text style={styles.subtitulo}>{temJogos ? 'Bom te ver de novo.' : 'Sua pilha de jogos começa aqui.'}</Text>
        </View>

        {/* Engrenagem: abre as Configurações */}
        <Pressable
          onPress={() => navegacaoPrincipal.navigate('Configuracoes')}
          accessibilityRole="button"
          accessibilityLabel="Configurações"
          style={({ pressed }) => [styles.botaoConfiguracoes, pressed && estilosGlobais.pressionado]}
        >
          <Ionicons name="settings-outline" size={20} color={cores.textoClaro} />
        </Pressable>
      </View>

      {/* Mesma faixa nos dois estados: sem jogos, os números aparecem apagados */}
      {(temJogos || vm.bibliotecaVazia) && (
        <View style={styles.resumo}>
          {vm.carregandoDados ? (
            <EstadoCarregando mensagem="Carregando informações..." />
          ) : (
            <FaixaResumo {...vm.resumo} apagado={!temJogos} />
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
          acao={{ titulo: 'Tentar de novo', onPress: vm.tentarNovamente }}
        />
      ) : temJogos ? (
        <>
          <CarrosselJogando
            jogos={vm.jogando}
            onRegistrarHoras={(item) => navegacaoPrincipal.navigate('RegistrarHoras', { id: item.id })}
            onAbrirJogo={abrirDetalhes}
            onAbrirBiblioteca={() => navegacaoAbas.navigate('Biblioteca', { filtro: 'NA_FILA' })}
          />
          {vm.jogadosRecentemente.length > 0 && (
            <View>
              <TituloSecao titulo="Jogados recentemente" link={{ texto: 'Ver todos', onPress: irParaBiblioteca }} />
              <View style={styles.listaRecentes}>
                {vm.jogadosRecentemente.map((item) => (
                  <CardJogo key={item.id} item={item} variante="compacto" onPress={abrirDetalhes} />
                ))}
              </View>
            </View>
          )}
        </>
      ) : (
        <>
          <CardFilaVazia onPesquisar={irParaPesquisa} />
          {/* Populares só com a biblioteca vazia; sem internet, a seção some */}
          {vm.carregandoPopulares && <EstadoCarregando mensagem="Buscando jogos populares..." />}
          {vm.populares.length > 0 && (
            <LinhaPopulares jogos={vm.populares} onVerMais={irParaPesquisa} onSelecionar={abrirAdicionar} />
          )}
        </>
      )}
    </ScrollView>
  );
}
