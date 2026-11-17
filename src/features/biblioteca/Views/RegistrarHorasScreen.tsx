import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EntradaAnimada, ToqueAnimado } from '../../../components/animacoes';
import BarraProgresso from '../../../components/BarraProgresso';
import Cabecalho from '../../../components/Cabecalho';
import CampoTexto from '../../../components/CampoTexto';
import EstadoVazio from '../../../components/EstadoVazio';
import { PrimaryButton } from '../../../components/PrimaryButton';
import TituloSecao from '../../../components/TituloSecao';
import type { RootStackParamList } from '../../../navigation/tipos';
import { estilosGlobais } from '../../../theme';
import { formatarHoras } from '../../../utils/formatarHoras';
import { SOMAS_RAPIDAS } from '../Model/registroHoras';
import { useRegistrarHorasViewModel } from '../ViewModel/useRegistrarHorasViewModel';
import { styles } from './styles/RegistrarHorasScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'RegistrarHoras'>;

// Tela 08 do protótipo. Abre pelo "Registrar horas" da Home e dos Detalhes.
// O progresso é medido em horas informadas pelo usuário; a barra é só uma estimativa
// pelo tempo médio da RAWG.
export default function RegistrarHorasScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useRegistrarHorasViewModel(route.params.id);

  // O jogo foi removido enquanto a tela estava aberta.
  if (!vm.item) {
    return (
      <View style={[estilosGlobais.tela, { paddingTop: insets.top + 8 }]}>
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
    <KeyboardAvoidingView style={estilosGlobais.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              // O View com flex 1 é que divide a largura: o ToqueAnimado aplica o style
              // por dentro, então o flex 1 do botão sozinho não funcionava.
              <View key={soma.rotulo} style={styles.itemSoma}>
                <ToqueAnimado
                  onPress={() => vm.somarMinutos(soma.minutos)}
                  accessibilityRole="button"
                  accessibilityLabel={`Somar ${soma.rotulo.replace('+', '')}`}
                  style={styles.botaoSoma}
                >
                  <Text style={styles.textoSoma}>{soma.rotulo}</Text>
                </ToqueAnimado>
              </View>
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
