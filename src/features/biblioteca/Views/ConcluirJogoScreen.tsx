import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntradaAnimada, movimentoReduzido, ToqueAnimado } from '../../../components/animacoes';
import CampoTexto from '../../../components/CampoTexto';
import Capa from '../../../components/Capa';
import Estrelas from '../../../components/Estrelas';
import Fogos from '../../../components/Fogos';
import { PrimaryButton } from '../../../components/PrimaryButton';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, estilosGlobais } from '../../../theme';
import { useConcluirViewModel } from '../ViewModel/useConcluirViewModel';
import { styles } from './styles/ConcluirJogoScreen.styles';

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
  // Cada vez que a nota vira 5 ("Obra-prima"), solta um estouro extra (a key nova recria os fogos).
  const [estourosObraPrima, setEstourosObraPrima] = useState(0);

  // O jogo foi removido enquanto a tela estava aberta: só fecha.
  if (!vm.item) {
    return (
      <View style={[estilosGlobais.tela, styles.centro]}>
        <PrimaryButton title="Voltar" onPress={navigation.goBack} style={styles.botaoVoltar} />
      </View>
    );
  }
  const { item } = vm;

  async function aoConcluir() {
    if (await vm.concluir()) {
      // Volta para as abas já na Biblioteca (fecha Concluir e Detalhes).
      navigation.popTo('Abas', { screen: 'Biblioteca' });
        }
  }

  return (
    <KeyboardAvoidingView style={estilosGlobais.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
          <Fogos explosoes={3} atraso={450} />
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
          {estourosObraPrima > 0 ? <Fogos key={estourosObraPrima} explosoes={1} atraso={0} topo={70} /> : null}
          <Text style={styles.tituloNota}>Que nota você dá?</Text>
          <Estrelas
            nota={vm.nota}
            onChange={(nota) => {
              if (nota === 5 && vm.nota !== 5) setEstourosObraPrima((n) => n + 1);
              vm.escolherNota(nota);
            }}
          />
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
