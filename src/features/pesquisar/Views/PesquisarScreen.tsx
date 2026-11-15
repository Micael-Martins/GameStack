import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { atrasoDaLista, EntradaAnimada } from '../../../components/animacoes';
import CampoTexto from '../../../components/CampoTexto';
import CardResultado from '../../../components/CardResultado';
import ChipFiltro from '../../../components/ChipFiltro';
import EstadoVazio from '../../../components/EstadoVazio';
import EstadoCarregando from '../../../components/EstadoCarregando';
import TituloSecao from '../../../components/TituloSecao';
import type { Jogo } from '../../../models/Jogo';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { usePesquisaViewModel } from '../ViewModel/usePesquisaViewModel';

// A RAWG exige o crédito nas telas que mostram os dados dela.
function CreditoRawg() {
  return <Text style={styles.credito}>Dados de jogos fornecidos pela RAWG</Text>;
}

// Telas 03 (antes de pesquisar) e 04 (resultados) do protótipo.
// A busca só vai para a RAWG quando o usuário aperta Enter (ou toca numa pesquisa recente).
export default function PesquisarScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const vm = usePesquisaViewModel();

  // Mostra a área de resultados depois do Enter; antes disso, a tela inicial.
  const emResultados = vm.carregando || vm.pesquisou;

  const subtitulo =
    vm.pesquisou && !vm.erro && vm.resultados.length > 0
      ? `${vm.total} ${vm.total === 1 ? 'resultado' : 'resultados'} para "${vm.termoPesquisado}"`
      : 'Encontre sua próxima aventura';

  // Já na biblioteca: abre os Detalhes. Senão: abre Adicionar (com o "Sobre o jogo").
  const abrirResultado = useCallback(
    (jogo: Jogo, idBiblioteca: string | null) =>
      idBiblioteca
        ? navigation.navigate('DetalhesJogo', { id: idBiblioteca })
        : navigation.navigate('AdicionarJogo', { jogo }),
    [navigation],
  );
  // Apagar o texto todo volta para a tela inicial.
  function alterarTermo(texto: string) {
    vm.setTermoDigitado(texto);
    if (!texto.trim()) vm.limparPesquisa();
  }

  // Qual "estado" a área de baixo está mostrando: ao trocar, o conteúdo entra suave.
  const estadoTela = !emResultados
    ? 'inicial'
    : vm.carregando
      ? 'carregando'
      : vm.erro && vm.resultados.length === 0
        ? 'erro'
        : vm.resultados.length === 0
          ? 'vazio'
          : `lista-${vm.termoPesquisado}`;

  function renderizarConteudo() {
    // Antes de pesquisar: pesquisas recentes e convite.
    if (!emResultados) {
      return (
        <ScrollView contentContainerStyle={styles.rolagem} keyboardShouldPersistTaps="handled">
          {vm.aviso ? <Text style={styles.aviso}>{vm.aviso}</Text> : null}

          {/* Some se não houver nenhuma pesquisa recente. */}
          {vm.pesquisasRecentes.length > 0 ? (
            <View style={styles.recentes}>
              <TituloSecao titulo="Pesquisas recentes" link={{ texto: 'Limpar', onPress: vm.limparHistorico }} />
              <View style={styles.chips}>
                {vm.pesquisasRecentes.map((recente, indice) => (
                  <EntradaAnimada key={recente} atraso={atrasoDaLista(indice, 40)} deslocamento={8}>
                    <ChipFiltro
                      texto={recente}
                      icone="time-outline"
                      selecionado={false}
                      onPress={() => vm.selecionarPesquisaRecente(recente)}
                    />
                  </EntradaAnimada>
                ))}
              </View>
            </View>
          ) : null}

          <EstadoVazio
            titulo="Sua próxima aventura começa aqui"
            descricao="Digite o nome de um jogo para buscar capa, plataformas e tempo médio."
            style={styles.vazio}
          />
          <CreditoRawg />
        </ScrollView>
      );
    }

    if (vm.carregando) {
      return (
        <View style={styles.centro}>
          <EstadoCarregando mensagem="Buscando jogos..." />
        </View>
      );
    }

    // Erro sem resultados na tela (se o erro foi ao carregar mais, a lista continua).
    if (vm.erro && vm.resultados.length === 0) {
      return (
        <View style={styles.centro}>
          <EstadoVazio
            titulo="Algo deu errado"
            descricao={vm.erro}
            icone="cloud-offline-outline"
            acao={{ titulo: 'Tentar de novo', onPress: vm.tentarNovamente }}
          />
        </View>
      );
    }

    if (vm.resultados.length === 0) {
      return (
        <View style={styles.centro}>
          <EstadoVazio
            titulo={`Nada encontrado para "${vm.termoPesquisado}"`}
            descricao="Confira a grafia ou tente outro nome."
            icone="search-outline"
          />
        </View>
      );
    }

    return (
      <FlatList
        data={vm.resultados}
        keyExtractor={(item) => item.jogo.apiId}
        renderItem={({ item, index }) => (
          <EntradaAnimada atraso={atrasoDaLista(index)}>
<CardResultado
              jogo={item.jogo}
              naBiblioteca={item.naBiblioteca}
              onTocar={(jogo) => abrirResultado(jogo, item.idBiblioteca)}
            />
                      </EntradaAnimada>
        )}
        ItemSeparatorComponent={() => <View style={styles.separador} />}
        contentContainerStyle={styles.lista}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onEndReached={() => { if (!vm.erro) void vm.carregarMais(); }}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <View>
            {vm.carregandoMais ? <ActivityIndicator color={cores.texto} style={styles.mais} /> : null}
            {vm.erro ? (
              <EstadoVazio
                titulo="Não foi possível carregar mais jogos"
                descricao={vm.erro}
                icone="cloud-offline-outline"
                acao={{
                  titulo: 'Tentar de novo',
                  onPress: vm.tentarNovamente,
                }}
              />
            ) : null}
            <CreditoRawg />
          </View>
        }
      />
    );
  }

  return (
    <View style={[styles.tela, { paddingTop: insets.top + 16 }]}>
      <View style={styles.topo}>
        <Text accessibilityRole="header" style={styles.titulo}>
          Pesquisar jogos
        </Text>
        <Text style={styles.subtitulo} numberOfLines={1}>
          {subtitulo}
        </Text>
        <CampoTexto
          value={vm.termoDigitado}
          onChangeText={alterarTermo}
          onSubmitEditing={() => void vm.pesquisar()}
          onLimpar={vm.limparPesquisa}
          icone="search"
          destacado={vm.termoDigitado.length > 0}
          placeholder="Pesquisar por título..."
          accessibilityLabel="Pesquisar por título"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>
      <EntradaAnimada key={estadoTela} deslocamento={8} style={styles.conteudo}>
        {renderizarConteudo()}
      </EntradaAnimada>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  topo: { paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: tipografia.tamanhos.titulo },
  subtitulo: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 14,
    marginTop: 2,
    marginBottom: espacamentos.gg,
  },
  conteudo: { flex: 1 },
  rolagem: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  aviso: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
    marginBottom: espacamentos.m,
    textAlign: 'center',
  },
  recentes: { marginBottom: espacamentos.gg },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: espacamentos.p, marginTop: espacamentos.p },
  vazio: { flexGrow: 1, minHeight: 280 },
  lista: { paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  separador: { height: espacamentos.m },
  centro: { flex: 1, justifyContent: 'center', paddingHorizontal: espacamentos.gg, paddingBottom: 60 },
  textoCarregando: {
    marginTop: espacamentos.m,
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
  },
  mais: { marginTop: espacamentos.g },
  credito: {
    marginTop: espacamentos.gg,
    textAlign: 'center',
    color: cores.textoFraco,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
});
