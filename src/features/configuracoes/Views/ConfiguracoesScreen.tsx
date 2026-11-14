import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Cabecalho from '../../../components/Cabecalho';
import CampoTexto from '../../../components/CampoTexto';
import Interruptor from '../../../components/Interruptor';
import TituloSecao from '../../../components/TituloSecao';
import { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { useConfiguracoesViewModel } from '../ViewModel/useConfiguracoesViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'Configuracoes'>;

// Tela 09 do protótipo. Abre pela engrenagem da Home.
export default function ConfiguracoesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useConfiguracoesViewModel();
  const horario = useHorarioAnimado(vm.lembretesAtivos, vm.carregado);

  function confirmarApagar() {
    Alert.alert(
      'Apagar todos os dados?',
      'Sua biblioteca, as horas, as notas e as preferências serão apagadas deste aparelho.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            if (await vm.apagarTudo()) {
              // reset: limpa o histórico e volta para as boas-vindas.
              navigation.reset({ index: 0, routes: [{ name: 'BoasVindas' }] });
            }
          },
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho titulo="Configurações" onVoltar={navigation.goBack} />

        <View style={styles.secao}>
          <TituloSecao titulo="Perfil" />
          <CampoTexto
            label="Nome"
            value={vm.nome}
            onChangeText={vm.setNome}
            onBlur={vm.salvarNome}
            onSubmitEditing={vm.salvarNome}
            placeholder="Seu nome"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={30}
            returnKeyType="done"
          />
        </View>

        <View style={styles.secao}>
          <TituloSecao titulo="Lembretes" />
          <View style={styles.card}>
            <View style={styles.linha}>
              <View style={styles.flex}>
                <Text style={styles.textoForte}>Lembretes ativos</Text>
                <Text style={styles.descricao}>Avisamos quando um jogo em Jogando fica 5 dias sem registro.</Text>
              </View>
              <Interruptor
                value={vm.lembretesAtivos}
                onValueChange={vm.alternarLembretes}
                accessibilityLabel="Lembretes ativos"
              />
            </View>

            {/* O horário só aparece com os lembretes ligados: abre e fecha deslizando. */}
            {horario.visivel ? (
              <Animated.View
                style={[
                  styles.linha,
                  styles.divisor,
                  styles.linhaAnimada,
                  {
                    height: horario.altura,
                    opacity: horario.opacidade,
                    transform: [{ translateY: horario.deslize }],
                  },
                ]}
              >
                <Text style={[styles.texto, styles.flex]}>Horário do lembrete</Text>
                <TextInput
                  value={vm.horario}
                  onChangeText={vm.alterarHorario}
                  onBlur={vm.salvarHorario}
                  onSubmitEditing={vm.salvarHorario}
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholder="19:00"
                  placeholderTextColor={cores.textoFraco}
                  selectionColor={cores.texto}
                  accessibilityLabel="Horário do lembrete"
                  style={[styles.horario, vm.erroHorario ? styles.horarioErro : null]}
                />
              </Animated.View>
            ) : null}
            {vm.lembretesAtivos && vm.erroHorario ? <Text style={styles.erro}>{vm.erroHorario}</Text> : null}
          </View>
          {vm.aviso ? <Text style={styles.aviso}>{vm.aviso}</Text> : null}
        </View>

        <View style={styles.secao}>
          <TituloSecao titulo="Dados" />
          <View style={styles.card}>
            <View style={styles.linha}>
              <Text style={[styles.texto, styles.flex]}>Jogos na biblioteca</Text>
              <Text style={styles.valor}>{vm.totalJogos}</Text>
            </View>
            <View style={[styles.linha, styles.divisor]}>
              <Text style={[styles.texto, styles.flex]}>Fonte dos dados</Text>
              <Text style={styles.valor}>RAWG</Text>
            </View>
            <Pressable
              onPress={confirmarApagar}
              disabled={vm.apagando}
              accessibilityRole="button"
              accessibilityLabel="Apagar todos os dados"
              style={({ pressed }) => [styles.linha, styles.divisor, pressed && styles.pressionado]}
            >
              <Text style={[styles.valor, styles.flex]}>Apagar todos os dados</Text>
              {vm.apagando ? <ActivityIndicator color={cores.textoSecundario} /> : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.flex} />
        <Text style={styles.versao}>Backlog Zero · versão 1.0</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const ALTURA_LINHA = 69; // minHeight 56 + borda 1 + folga do campo de 44 com padding 12

// Abre e fecha a linha do horário. Fica montada até a animação de saída terminar.
// Na primeira leitura do usuário não anima (a tela já abre no estado certo), e
// respeita a opção "reduzir movimento" do celular.
function useHorarioAnimado(ligado: boolean, carregado: boolean) {
  const progresso = useRef(new Animated.Value(ligado ? 1 : 0)).current;
  const [visivel, setVisivel] = useState(ligado);
  const primeiraVez = useRef(true);

  useEffect(() => {
    if (!carregado) return;
    if (primeiraVez.current) {
      primeiraVez.current = false;
      progresso.setValue(ligado ? 1 : 0);
      setVisivel(ligado);
      return;
    }

    let cancelado = false;
    if (ligado) setVisivel(true);
    AccessibilityInfo.isReduceMotionEnabled()
      .catch(() => false)
      .then((reduzir) => {
        if (cancelado) return;
        Animated.timing(progresso, {
          toValue: ligado ? 1 : 0,
          duration: reduzir ? 0 : ligado ? 260 : 200,
          useNativeDriver: false, // altura não roda no driver nativo
        }).start(({ finished }) => {
          if (finished && !ligado && !cancelado) setVisivel(false);
        });
      });
    return () => {
      cancelado = true;
    };
  }, [ligado, carregado, progresso]);

  return {
    visivel,
    altura: progresso.interpolate({ inputRange: [0, 1], outputRange: [0, ALTURA_LINHA] }),
    opacidade: progresso.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 0, 1] }),
    deslize: progresso.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }),
  };
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg },
  flex: { flex: 1 },
  secao: { marginTop: espacamentos.gg, gap: espacamentos.p },
  card: {
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
    overflow: 'hidden',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    minHeight: 56,
    paddingHorizontal: espacamentos.g,
    paddingVertical: espacamentos.m,
  },
  divisor: { borderTopWidth: 1, borderTopColor: cores.borda },
  linhaAnimada: { minHeight: 0, paddingVertical: 0, overflow: 'hidden' },
  texto: { color: cores.texto, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.corpo },
  textoForte: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: tipografia.tamanhos.corpo },
  descricao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
    marginTop: 2,
  },
  valor: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.corpo },
  horario: {
    width: 84,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: tipografia.tamanhos.corpo,
  },
  horarioErro: { borderColor: cores.textoSecundario, borderStyle: 'dashed' },
  erro: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
    paddingHorizontal: espacamentos.g,
    paddingBottom: espacamentos.m,
  },
  aviso: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: tipografia.tamanhos.legenda },
  pressionado: { opacity: 0.7 },
  versao: {
    marginTop: 32,
    textAlign: 'center',
    color: cores.textoFraco,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
});
