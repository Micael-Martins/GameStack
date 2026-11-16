import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntradaAnimada, ToqueAnimado } from '../../../components/animacoes';
import Cabecalho from '../../../components/Cabecalho';
import CampoTexto from '../../../components/CampoTexto';
import Capa from '../../../components/Capa';
import {
  linhaDesenvolvedora,
  linhaPlataformasGenero,
  textoLancamento,
  textoTempoMedio,
} from '../../../components/utils/cardResultadoUtils';
import { PrimaryButton } from '../../../components/PrimaryButton';
import TituloSecao from '../../../components/TituloSecao';
import type { StatusJogo } from '../../../models/StatusJogo';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, estilosGlobais } from '../../../theme';
import { OPCOES_STATUS_INICIAL } from '../Model/adicionarJogo';
import { useAdicionarViewModel } from '../ViewModel/useAdicionarViewModel';
import { styles } from './styles/AdicionarJogoScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'AdicionarJogo'>;

// Bolinha do rádio: cresce com uma mola ao ser marcada.
function MioloRadio({ marcado }: { marcado: boolean }) {
  const escala = useRef(new Animated.Value(marcado ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(escala, { toValue: marcado ? 1 : 0, friction: 6, tension: 180, useNativeDriver: true }).start();
  }, [marcado, escala]);

  return <Animated.View style={[styles.radioMiolo, { transform: [{ scale: escala }] }]} />;
}

// Tela 05 do protótipo. Abre ao tocar num resultado da pesquisa (ou num popular da Home).
export default function AdicionarJogoScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useAdicionarViewModel(route.params.jogo);
  const { jogo } = vm;
  const tempoMedio = textoTempoMedio(jogo.tempoMedio);
  const [textoAberto, setTextoAberto] = useState(false); // "Ler mais" da descrição
  const lancamento = textoLancamento(vm.sobre?.dataLancamento ?? null);
  const temSobre = !!vm.sobre && (!!vm.sobre.descricao || vm.sobre.metacritic !== null || !!lancamento);

  // Trocar o status anima o campo de horas abrindo ou fechando (ele some em Na fila).
  function escolherStatus(status: StatusJogo) {
    if (status === vm.status) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    vm.setStatus(status);
  }

  async function aoAdicionar() {
    if (await vm.adicionar()) {
      // Volta para as abas já na Biblioteca.
      navigation.popTo('Abas', { screen: 'Biblioteca' });
        }
  }

  return (
    <KeyboardAvoidingView style={estilosGlobais.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 8 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho titulo="Adicionar jogo" onVoltar={navigation.goBack} />

        <EntradaAnimada style={styles.cardJogo}>
          <Capa imagemURL={jogo.imagemURL} tamanho="G" descricao={`Capa de ${jogo.nome}`} />
          <View style={styles.textosJogo}>
            <Text style={styles.nomeJogo} numberOfLines={3}>
              {jogo.nome}
            </Text>
            {vm.carregandoDetalhes ? (
              <ActivityIndicator size="small" color={cores.textoSecundario} style={styles.carregando} />
            ) : linhaDesenvolvedora(jogo) ? (
              <Text style={styles.detalhe} numberOfLines={1}>
                {linhaDesenvolvedora(jogo)}
              </Text>
            ) : null}
            {linhaPlataformasGenero(jogo) ? (
              <Text style={styles.detalhe} numberOfLines={1}>
                {linhaPlataformasGenero(jogo)}
              </Text>
            ) : null}
            {tempoMedio ? (
              <View style={styles.linhaTempo}>
                <Ionicons name="time-outline" size={14} color={cores.textoSecundario} />
                <Text style={styles.detalhe}>{tempoMedio}</Text>
              </View>
            ) : null}
          </View>
        </EntradaAnimada>

        {/* Sobre o jogo: só aparece quando a RAWG mandou alguma dessas informações */}
        {temSobre && vm.sobre ? (
          <EntradaAnimada style={styles.secao}>
            <TituloSecao titulo="Sobre o jogo" />
            {vm.sobre.metacritic !== null || lancamento ? (
              <View style={styles.selos}>
                {vm.sobre.metacritic !== null ? (
                  <View style={styles.selo} accessible accessibilityLabel={`Nota ${vm.sobre.metacritic} no Metacritic`}>
                    <Text style={styles.notaMetacritic}>{vm.sobre.metacritic}</Text>
                    <Text style={styles.textoSelo}>Metacritic</Text>
                  </View>
                ) : null}
                {lancamento ? (
                  <View style={[styles.selo, styles.seloSimples]}>
                    <Ionicons name="calendar-outline" size={16} color={cores.textoSecundario} />
                    <Text style={styles.textoSelo}>{lancamento}</Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            {vm.sobre.descricao ? (
              <>
                <Text style={styles.descricao} numberOfLines={textoAberto ? undefined : 4}>
                  {vm.sobre.descricao}
                </Text>
                <Text
                  accessibilityRole="button"
                  accessibilityState={{ expanded: textoAberto }}
                  onPress={() => setTextoAberto(!textoAberto)}
                  style={styles.lerMais}
                >
                  {textoAberto ? 'Ler menos' : 'Ler mais'}
                </Text>
              </>
            ) : null}
          </EntradaAnimada>
        ) : null}

        <EntradaAnimada atraso={70} style={styles.secao}>
          <TituloSecao titulo="Status inicial" />
          <View style={styles.opcoes} accessibilityRole="radiogroup">
            {OPCOES_STATUS_INICIAL.map((opcao) => {
              const selecionada = vm.status === opcao.status;
              return (
                <ToqueAnimado
                  key={opcao.status}
                  onPress={() => escolherStatus(opcao.status)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selecionada }}
                  accessibilityLabel={opcao.rotulo}
                  style={[styles.opcao, selecionada && styles.opcaoSelecionada]}
                >
                  <View style={[styles.radio, selecionada && styles.radioSelecionado]}>
                    <MioloRadio marcado={selecionada} />
                  </View>
                  <Text style={styles.textoOpcao}>{opcao.rotulo}</Text>
                </ToqueAnimado>
              );
            })}
          </View>
        </EntradaAnimada>

        {/* Na fila começa com 0h, então o campo some. */}
        {vm.mostrarCampoHoras ? (
          <View style={styles.secao}>
            <CampoTexto
              label="Quanto você já jogou? (opcional)"
              placeholder="0"
              sufixo="horas"
              keyboardType="decimal-pad"
              value={vm.horas}
              onChangeText={vm.alterarHoras}
              maxLength={8}
            />
            {vm.erroHoras ? <Text style={styles.erro}>{vm.erroHoras}</Text> : null}
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        {vm.erro ? <Text style={[styles.erro, styles.erroRodape]}>{vm.erro}</Text> : null}
        <PrimaryButton title="Adicionar à biblioteca" onPress={() => void aoAdicionar()} loading={vm.salvando} />
      </View>
    </KeyboardAvoidingView>
  );
}
