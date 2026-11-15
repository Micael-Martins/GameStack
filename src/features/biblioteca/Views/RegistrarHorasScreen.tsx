import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntradaAnimada, ToqueAnimado } from '../../../components/animacoes';
import BarraProgresso from '../../../components/BarraProgresso';
import Cabecalho from '../../../components/Cabecalho';
import CampoTexto from '../../../components/CampoTexto';
import EstadoVazio from '../../../components/EstadoVazio';
import { PrimaryButton } from '../../../components/PrimaryButton';
import TituloSecao from '../../../components/TituloSecao';
import type { RootStackParamList } from '../../../navigation/tipos';
import { cores, espacamentos, tipografia } from '../../../theme';
import { formatarHoras } from '../../../utils/formatarHoras';
import { SOMAS_RAPIDAS } from '../Model/registroHoras';
import { useProgressoViewModel } from '../ViewModel/useProgressoViewModel';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarHoras'>;

// Tela 08 do protótipo. Abre pelo "Registrar horas" da Home e dos Detalhes.
// O progresso é medido em horas informadas pelo usuário; a barra é só uma estimativa
// pelo tempo médio da RAWG.
export default function RegistrarHorasScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useProgressoViewModel(route.params.id);

  // O jogo foi removido enquanto a tela estava aberta.
  if (!vm.item) {
    return (
      <View style={[styles.tela, { paddingTop: insets.top + 8 }]}>
        <View style={styles.margem}>
          <Cabecalho titulo="Registrar horas" onVoltar={navigation.goBack} />
        </View>
        <View style={[styles.margem, styles.centro]}>
          <EstadoVazio titulo="Jogo não encontrado" descricao="Ele pode ter sido removido da sua biblioteca." />
        </View>
      </View>
    );
  }

  async function aoSalvar() {
    if (await vm.salvar()) navigation.goBack();
  }

  return (
    <KeyboardAvoidingView style={styles.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.conteudo, { paddingTop: insets.top + 8 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Cabecalho titulo="Registrar horas" subtitulo={vm.item.jogo.nome} onVoltar={navigation.goBack} />

        {/* Card central: tempo total */}
        <EntradaAnimada style={styles.cardTotal}>
          <Text style={styles.rotuloTotal}>Tempo total</Text>
          <Text style={styles.total} accessibilityLiveRegion="polite">
            {formatarHoras(vm.minutos)}
          </Text>
          <Text style={styles.sessao}>{vm.textoSessao}</Text>
          {vm.percentual !== null ? (
            <View style={styles.areaBarra}>
              <BarraProgresso
                valor={vm.progressoBarra}
                temTempoMedio
                descricao={`${vm.percentual}% do tempo médio`}
              />
              <View style={styles.linhaBarra}>
                <Text style={styles.legenda}>{vm.percentual}% do tempo médio</Text>
                <Text style={styles.legenda}>~{vm.tempoMedio}h em média</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.legenda}>A RAWG não tem o tempo médio deste jogo</Text>
          )}
        </EntradaAnimada>

        {/* Somas rápidas */}
        <EntradaAnimada atraso={70} style={styles.secao}>
          <TituloSecao titulo="Quanto você jogou hoje?" />
          <View style={styles.botoes}>
            {SOMAS_RAPIDAS.map((soma) => (
              <ToqueAnimado
                key={soma.rotulo}
                onPress={() => vm.somarMinutos(soma.minutos)}
                accessibilityRole="button"
                accessibilityLabel={`Somar ${soma.rotulo.replace('+', '')}`}
                style={styles.botaoSoma}
              >
                <Text style={styles.textoSoma}>{soma.rotulo}</Text>
              </ToqueAnimado>
            ))}
          </View>
          <Pressable
            onPress={vm.desfazerUltima}
            disabled={!vm.podeDesfazer}
            accessibilityRole="button"
            accessibilityLabel="Desfazer a última mudança"
            accessibilityState={{ disabled: !vm.podeDesfazer }}
            style={({ pressed }) => [styles.desfazer, pressed && styles.pressionado]}
          >
            <Text style={[styles.textoDesfazer, !vm.podeDesfazer && styles.desabilitado]}>Desfazer</Text>
          </Pressable>
        </EntradaAnimada>

        {/* Total do console: substitui o total */}
        <EntradaAnimada atraso={140} style={styles.secao}>
          <CampoTexto
            label="Ou digite o total que aparece no console"
            placeholder="Ex.: 44"
            sufixo="horas"
            keyboardType="decimal-pad"
            value={vm.totalDigitado}
            onChangeText={vm.alterarTotalDigitado}
            onBlur={() => vm.aplicarTotalDigitado()}
            onSubmitEditing={() => vm.aplicarTotalDigitado()}
            returnKeyType="done"
            maxLength={8}
          />
          {vm.erroTotal ? (
            <Text accessibilityRole="alert" style={styles.erro}>
              {vm.erroTotal}
            </Text>
          ) : null}
        </EntradaAnimada>

        {/* Anotação opcional */}
        <EntradaAnimada atraso={210} style={styles.secao}>
          <CampoTexto
            label="Anotação (opcional)"
            placeholder="Onde você parou? Alguma meta para a próxima sessão?"
            value={vm.anotacao}
            onChangeText={vm.setAnotacao}
            multiline
            maxLength={500}
          />
        </EntradaAnimada>
      </ScrollView>

      <View style={[styles.rodape, { paddingBottom: insets.bottom + 16 }]}>
        {vm.vaiComecar ? <Text style={styles.aviso}>Ao salvar, o jogo sai da fila e vai para Jogando.</Text> : null}
        {vm.erro ? (
          <Text accessibilityRole="alert" style={styles.erro}>
            {vm.erro}
          </Text>
        ) : null}
        <PrimaryButton title="Salvar progresso" onPress={() => void aoSalvar()} loading={vm.salvando} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  margem: { paddingHorizontal: espacamentos.gg },
  centro: { flex: 1, justifyContent: 'center' },
  conteudo: { flexGrow: 1, paddingHorizontal: espacamentos.gg, paddingBottom: espacamentos.gg },
  pressionado: { opacity: 0.6 },

  cardTotal: {
    alignItems: 'center',
    gap: 4,
    marginTop: espacamentos.m,
    paddingVertical: 22,
    paddingHorizontal: espacamentos.g,
    borderRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  rotuloTotal: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  total: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 44, letterSpacing: -1 },
  sessao: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  areaBarra: { alignSelf: 'stretch', gap: 8, marginTop: 14 },
  linhaBarra: { flexDirection: 'row', justifyContent: 'space-between' },
  legenda: { color: cores.textoFraco, fontFamily: tipografia.fontes.regular, fontSize: 12 },

  secao: { marginTop: espacamentos.gg, gap: espacamentos.p },
  botoes: { flexDirection: 'row', gap: espacamentos.p },
  botaoSoma: {
    flex: 1,
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoSoma: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 16 },
  desfazer: { alignSelf: 'center', minHeight: 44, paddingHorizontal: 16, justifyContent: 'center' },
  textoDesfazer: { color: cores.textoSecundario, fontFamily: tipografia.fontes.semiBold, fontSize: 14 },
  desabilitado: { opacity: 0.4 },

  rodape: { gap: espacamentos.p, paddingHorizontal: espacamentos.gg, paddingTop: espacamentos.m, backgroundColor: cores.fundo },
  aviso: { textAlign: 'center', color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  erro: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
