import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Cabecalho from '../../../components/Cabecalho';
import CampoTexto from '../../../components/CampoTexto';
import Capa from '../../../components/Capa';
import EstadoVazio from '../../../components/EstadoVazio';
import { PrimaryButton } from '../../../components/PrimaryButton';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { formatarHoras } from '../../../utils/formatarHoras';
import { calcularTotalMinutos, converterHorasParaMinutos } from '../Model/registroHoras';
import { useRegistrarHorasViewModel } from '../ViewModel/useRegistrarHorasViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarHoras'>;

export default function RegistrarHorasScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useRegistrarHorasViewModel(route.params.id);

  if (!vm.item) {
    return (
      <View style={[styles.tela, { paddingTop: insets.top + 8 }]}>
        <View style={styles.cabecalhoErro}>
          <Cabecalho titulo="Registrar horas" onVoltar={navigation.goBack} />
        </View>
        <View style={styles.estadoSemJogo}>
          <EstadoVazio titulo="Jogo não encontrado" descricao="Ele pode ter sido removido da sua biblioteca." />
        </View>
      </View>
    );
  }

  const minutosDaSessao = converterHorasParaMinutos(vm.horas);
  const totalPrevisto = minutosDaSessao === null
    ? vm.item.minutosJogados
    : calcularTotalMinutos(vm.item.minutosJogados, minutosDaSessao);

  async function salvar() {
    if (await vm.salvar()) navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho titulo="Registrar horas" onVoltar={navigation.goBack} />

        <View style={styles.jogo}>
          <Capa imagemURL={vm.item.jogo.imagemURL} tamanho="M" descricao={`Capa de ${vm.item.jogo.nome}`} />
          <View style={styles.dadosJogo}>
            <Text accessibilityRole="header" style={styles.nomeJogo} numberOfLines={2}>{vm.item.jogo.nome}</Text>
            <Text style={styles.tempoAtual}>Total atual: {formatarHoras(vm.item.minutosJogados)}</Text>
          </View>
        </View>

        <View style={styles.cartao}>
          <View style={styles.iconeTempo}>
            <Ionicons name="time-outline" size={24} color={cores.texto} />
          </View>
          <Text style={styles.titulo}>Quanto tempo você jogou?</Text>
          <Text style={styles.descricao}>Informe as horas desta sessão. Vamos somá-las ao total já registrado.</Text>

          <CampoTexto
            label="Duração da sessão"
            value={vm.horas}
            onChangeText={vm.setHoras}
            placeholder="Ex.: 1,5"
            keyboardType="decimal-pad"
            sufixo="horas"
            maxLength={8}
            accessibilityLabel="Horas desta sessão"
          />

          {vm.erro ? <Text accessibilityRole="alert" style={styles.erro}>{vm.erro}</Text> : null}

          <View style={styles.resumo}>
            <Text style={styles.rotuloResumo}>Novo total</Text>
            <Text style={styles.valorResumo}>{formatarHoras(totalPrevisto)}</Text>
          </View>
        </View>

        <PrimaryButton title="Salvar horas" onPress={() => void salvar()} loading={vm.salvando} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  cabecalhoErro: { paddingHorizontal: espacamentos.m },
  estadoSemJogo: { flex: 1, paddingHorizontal: espacamentos.m, justifyContent: 'center' },
  conteudo: { paddingHorizontal: espacamentos.m, gap: 24 },
  jogo: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: cores.card, borderRadius: 18 },
  dadosJogo: { flex: 1, gap: 6 },
  nomeJogo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 18, lineHeight: 24 },
  tempoAtual: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14 },
  cartao: { gap: 16, padding: 20, backgroundColor: cores.card, borderRadius: 20, borderWidth: 1, borderColor: cores.borda },
  iconeTempo: { width: 48, height: 48, borderRadius: 16, backgroundColor: cores.borda, alignItems: 'center', justifyContent: 'center' },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 20 },
  descricao: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14, lineHeight: 21 },
  erro: { color: '#FF8A8A', fontFamily: tipografia.fontes.regular, fontSize: 13 },
  resumo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderTopColor: cores.borda },
  rotuloResumo: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  valorResumo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 18 },
});
