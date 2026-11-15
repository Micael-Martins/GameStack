import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
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
  textoTempoMedio,
} from '../../../components/cardResultadoUtils';
import { PrimaryButton } from '../../../components/PrimaryButton';
import TituloSecao from '../../../components/TituloSecao';
import type { StatusJogo } from '../../../models/StatusJogo';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { OPCOES_STATUS_INICIAL } from '../Model/adicionarJogo';
import { useAdicionarViewModel } from '../ViewModel/useAdicionarViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'AdicionarJogo'>;

// Bolinha do rádio: cresce com uma mola ao ser marcada.
function MioloRadio({ marcado }: { marcado: boolean }) {
  const escala = useRef(new Animated.Value(marcado ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(escala, { toValue: marcado ? 1 : 0, friction: 6, tension: 180, useNativeDriver: true }).start();
  }, [marcado, escala]);

  return <Animated.View style={[styles.radioMiolo, { transform: [{ scale: escala }] }]} />;
}

// Tela 05 do protótipo. Abre ao tocar no "+" de um resultado da pesquisa.
export default function AdicionarJogoScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useAdicionarViewModel(route.params.jogo);
  const { jogo } = vm;
  const tempoMedio = textoTempoMedio(jogo.tempoMedio);

  // Trocar o status anima o campo de horas abrindo ou fechando (ele some em Na fila).
  function escolherStatus(status: StatusJogo) {
    if (status === vm.status) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    vm.setStatus(status);
  }

  async function aoAdicionar() {
    if (await vm.adicionar()) {
      // Volta para as abas já na Biblioteca.
      navigation.navigate('Abas', { screen: 'Biblioteca' });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.gg },
  cardJogo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.g,
    marginTop: espacamentos.m,
    padding: 14,
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  textosJogo: { flex: 1, minWidth: 0, gap: 3 },
  nomeJogo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 18, lineHeight: 23 },
  detalhe: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  carregando: { alignSelf: 'flex-start', marginVertical: 2 },
  linhaTempo: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  secao: { marginTop: espacamentos.gg, gap: espacamentos.p },
  opcoes: { gap: 10 },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    minHeight: 52,
    paddingHorizontal: espacamentos.g,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  opcaoSelecionada: { borderColor: cores.texto },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#3A3A3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelecionado: { borderColor: cores.texto },
  radioMiolo: { width: 12, height: 12, borderRadius: 6, backgroundColor: cores.texto },
  textoOpcao: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 15 },
  erro: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  erroRodape: { textAlign: 'center', marginBottom: espacamentos.m },
  rodape: { paddingHorizontal: espacamentos.gg, paddingTop: espacamentos.m, backgroundColor: cores.fundo },
});
