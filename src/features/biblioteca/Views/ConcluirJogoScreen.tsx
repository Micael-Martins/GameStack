import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntradaAnimada, movimentoReduzido, ToqueAnimado } from '../../../components/animacoes';
import CampoTexto from '../../../components/CampoTexto';
import Capa from '../../../components/Capa';
import Estrelas from '../../../components/Estrelas';
import { PrimaryButton } from '../../../components/PrimaryButton';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { useConcluirViewModel } from '../ViewModel/useConcluirViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'ConcluirJogo'>;

// Anel do logo fechado com o check: entra crescendo com uma mola e o check aparece logo depois.
function AnelConcluido() {
  const anel = useRef(new Animated.Value(movimentoReduzido() ? 1 : 0)).current;
  const check = useRef(new Animated.Value(movimentoReduzido() ? 1 : 0)).current;

  useEffect(() => {
    if (movimentoReduzido()) return;
    Animated.sequence([
      Animated.spring(anel, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }),
      Animated.spring(check, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }),
    ]).start();
  }, [anel, check]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.anel, { opacity: anel, transform: [{ scale: anel }] }]}
    >
      <Animated.View style={{ transform: [{ scale: check }] }}>
        <Ionicons name="checkmark" size={46} color={cores.texto} />
      </Animated.View>
    </Animated.View>
  );
}

// Tela 10 do protótipo. Abre pelo "Concluir jogo" do painel Mudar status.
export default function ConcluirJogoScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useConcluirViewModel(route.params.id);

  // O jogo foi removido enquanto a tela estava aberta: só fecha.
  if (!vm.item) {
    return (
      <View style={[styles.tela, styles.centro]}>
        <PrimaryButton title="Voltar" onPress={navigation.goBack} style={styles.botaoVoltar} />
      </View>
    );
  }
  const { item } = vm;

  async function aoConcluir() {
    if (await vm.concluir()) {
      // Volta para as abas já na Biblioteca (fecha Concluir e Detalhes).
      navigation.navigate('Abas', { screen: 'Biblioteca' });
    }
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 8 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topo}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar sem concluir"
            onPress={navigation.goBack}
            hitSlop={8}
            style={({ pressed }) => [styles.fechar, pressed && styles.pressionado]}
          >
            <Ionicons name="close" size={24} color={cores.texto} />
          </Pressable>
        </View>

        {/* Comemoração */}
        <View style={styles.cabecalho}>
          <AnelConcluido />
          <EntradaAnimada atraso={250}>
            <Text style={styles.selo}>JOGO CONCLUÍDO</Text>
            <Text accessibilityRole="header" style={styles.titulo}>
              Zerou!
            </Text>
          </EntradaAnimada>
          <EntradaAnimada atraso={330}>
            <Text style={styles.nomeJogo} numberOfLines={2}>
              {item.jogo.nome}
            </Text>
            <Text style={styles.resumo}>{vm.resumo}</Text>
          </EntradaAnimada>
        </View>

        {/* Nota */}
        <EntradaAnimada atraso={420} style={styles.cardNota}>
          <Text style={styles.tituloNota}>Que nota você dá?</Text>
          <Estrelas nota={vm.nota} onChange={vm.escolherNota} />
          <Text style={[styles.textoNota, vm.nota !== null && styles.textoNotaEscolhida]}>{vm.textoNota}</Text>
        </EntradaAnimada>

        {/* Anotação final */}
        <EntradaAnimada atraso={480} style={styles.secao}>
          <CampoTexto
            label="O que você achou? (opcional)"
            value={vm.anotacao}
            onChangeText={vm.setAnotacao}
            placeholder="A exploração livre é incrível. Deixei algumas missões secundárias para depois."
            multiline
            maxLength={500}
          />
        </EntradaAnimada>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        {/* Próximo da fila: some se a fila estiver vazia */}
        {vm.proximo ? (
          <EntradaAnimada atraso={540} style={styles.cardProximo}>
            <Capa imagemURL={vm.proximo.jogo.imagemURL} tamanho="P" descricao={`Capa de ${vm.proximo.jogo.nome}`} />
            <View style={styles.textosProximo}>
              <Text style={styles.rotuloProximo}>{vm.comecouProximo ? 'AGORA EM JOGANDO' : 'PRÓXIMO DA FILA'}</Text>
              <Text style={styles.nomeProximo} numberOfLines={1}>
                {vm.proximo.jogo.nome}
              </Text>
            </View>
            {vm.comecouProximo ? (
              <EntradaAnimada deslocamento={0}>
                <Ionicons name="checkmark-circle" size={28} color={cores.texto} accessibilityLabel="Começou" />
              </EntradaAnimada>
            ) : (
              <ToqueAnimado
                onPress={() => void vm.comecarProximo()}
                disabled={vm.comecando}
                accessibilityRole="button"
                accessibilityLabel={`Começar ${vm.proximo.jogo.nome}`}
                style={styles.botaoComecar}
              >
                {vm.comecando ? (
                  <ActivityIndicator size="small" color={cores.texto} />
                ) : (
                  <Text style={styles.textoComecar}>Começar</Text>
                )}
              </ToqueAnimado>
            )}
          </EntradaAnimada>
        ) : null}

        {vm.erro ? (
          <Text accessibilityRole="alert" style={styles.erro}>
            {vm.erro}
          </Text>
        ) : null}
        <PrimaryButton title="Salvar e concluir" onPress={() => void aoConcluir()} loading={vm.salvando} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  centro: { justifyContent: 'center', paddingHorizontal: espacamentos.gg },
  botaoVoltar: { alignSelf: 'stretch' },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.g },
  topo: { flexDirection: 'row', justifyContent: 'flex-end' },
  fechar: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pressionado: { opacity: 0.6 },

  cabecalho: { alignItems: 'center', gap: 6, marginTop: 4 },
  anel: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 8,
    borderColor: cores.texto,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  selo: {
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 12,
    letterSpacing: 1.6,
  },
  titulo: {
    textAlign: 'center',
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 34,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  nomeJogo: {
    textAlign: 'center',
    color: '#D4D4D4',
    fontFamily: tipografia.fontes.regular,
    fontSize: 15,
    marginTop: 4,
  },
  resumo: {
    textAlign: 'center',
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
    marginTop: 4,
  },

  cardNota: {
    alignItems: 'center',
    gap: 8,
    marginTop: espacamentos.gg,
    paddingVertical: 18,
    paddingHorizontal: espacamentos.g,
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  tituloNota: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 16 },
  textoNota: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  textoNotaEscolhida: { color: cores.texto, fontFamily: tipografia.fontes.semiBold },

  secao: { marginTop: espacamentos.gg },

  rodape: { gap: espacamentos.m, paddingHorizontal: espacamentos.gg, paddingTop: espacamentos.m, backgroundColor: cores.fundo },
  cardProximo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    padding: espacamentos.m,
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#3A3A3A',
  },
  textosProximo: { flex: 1, minWidth: 0, gap: 2 },
  rotuloProximo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 11, letterSpacing: 1 },
  nomeProximo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 15 },
  botaoComecar: {
    minWidth: 92,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: cores.borda,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoComecar: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  erro: { textAlign: 'center', color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
