import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BarraProgresso from "../../../components/BarraProgresso";
import CampoTexto from "../../../components/CampoTexto";
import Capa from "../../../components/Capa";
import Estrelas from "../../../components/Estrelas";
import { PrimaryButton } from "../../../components/PrimaryButton";
import StatusChip from "../../../components/StatusChip";
import type { RootStackParamList } from "../../../navigation/tipos";
import { cores, estilosGlobais } from "../../../theme";
import { prepararDadosCardJogo } from "../../../utils/cardJogoUtils";
import {
    linhaDesenvolvedora,
    linhaPlataformasGenero,
} from "../../../utils/cardResultadoUtils";
import { formatarHoras } from "../../../utils/formatarHoras";
import { progressoDoTempo } from "../Model/detalhesJogo";
import { useDetalhesViewModel } from "../ViewModel/useDetalhesViewModel";
import BotaoRemoverJogo from "./components/BotaoRemoverJogo";
import PainelMudarStatus from "./components/PainelMudarStatus";
import { styles } from "./styles/DetalhesJogoScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "DetalhesJogo">;

// Tela 07 do protótipo. Abre ao tocar num jogo da biblioteca (Home, Biblioteca).
export default function DetalhesJogoScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useDetalhesViewModel(route.params.id);
  const item = vm.item;

  // Depois de remover, o jogo some da store: a tela só espera o "voltar".
  if (!item) return <View style={estilosGlobais.tela} />;

  const dados = prepararDadosCardJogo(item);
  const desenvolvedoraAno = linhaDesenvolvedora(item.jogo);
  const generoPlataformas = linhaPlataformasGenero(item.jogo);

  async function aoSalvar() {
    if (await vm.salvar()) navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      style={estilosGlobais.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.conteudo,
          { paddingTop: insets.top + 8 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Topo: voltar e lixeira */}
        <View style={styles.topo}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            onPress={navigation.goBack}
            style={({ pressed }) => [
              styles.botaoVoltar,
              pressed && estilosGlobais.pressionado,
            ]}
          >
            <Ionicons name="chevron-back" size={24} color={cores.texto} />
          </Pressable>
          <BotaoRemoverJogo item={item} onRemovido={navigation.goBack} />
        </View>

        {/* Capa e dados do jogo */}
        <View style={styles.cabecalhoJogo}>
          <Capa
            imagemURL={item.jogo.imagemURL}
            tamanho="G"
            descricao={`Capa de ${item.jogo.nome}`}
          />
          <View style={styles.textosJogo}>
            <Text
              accessibilityRole="header"
              style={styles.nome}
              numberOfLines={3}
            >
              {item.jogo.nome}
            </Text>
            {desenvolvedoraAno ? (
              <Text style={styles.detalhe}>{desenvolvedoraAno}</Text>
            ) : null}
            {generoPlataformas ? (
              <Text style={styles.detalhe}>{generoPlataformas}</Text>
            ) : null}
          </View>
        </View>

        {/* Status em destaque */}
        <View style={[styles.card, styles.cardStatus]}>
          <StatusChip status={item.status} grande />
          <Text style={styles.fraseStatus}>{vm.fraseStatus}</Text>
        </View>

        {/* Tempo jogado */}
        <View style={styles.card}>
          <View style={styles.linhaTempo}>
            <Text style={styles.horas}>
              {formatarHoras(item.minutosJogados)}
            </Text>
            {item.jogo.tempoMedio > 0 ? (
              <Text style={styles.detalhe}>de ~{item.jogo.tempoMedio}h</Text>
            ) : null}
          </View>
          {item.jogo.tempoMedio > 0 ? (
            <>
              <BarraProgresso
                valor={progressoDoTempo(item)}
                temTempoMedio
                descricao={`Progresso de ${item.jogo.nome}: ${dados.textoHoras}`}
              />
              <Text style={styles.legenda}>
                Estimativa pelo tempo médio dos jogadores na RAWG
              </Text>
            </>
          ) : (
            <Text style={styles.legenda}>
              A RAWG não tem o tempo médio deste jogo
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate("RegistrarHoras", { id: item.id })
            }
            style={({ pressed }) => [
              estilosGlobais.botaoContorno,
              styles.botaoContorno,
              pressed && estilosGlobais.pressionado,
            ]}
          >
            <Ionicons name="time-outline" size={18} color={cores.texto} />
            <Text style={estilosGlobais.textoBotaoContorno}>
              Registrar horas
            </Text>
          </Pressable>
        </View>

        {/* Datas */}
        <View style={styles.informacoes}>
          {vm.informacoes.map((linha) => (
            <View key={linha.rotulo} style={styles.linhaInformacao}>
              <Text style={styles.rotuloInformacao}>{linha.rotulo}</Text>
              <Text style={styles.valorInformacao}>{linha.valor}</Text>
            </View>
          ))}
          {item.nota !== null ? (
            <View style={styles.linhaInformacao}>
              <Text style={styles.rotuloInformacao}>Sua nota</Text>
              <Estrelas nota={item.nota} />
            </View>
          ) : null}
        </View>

        {/* Anotação */}
        <View style={styles.secaoAnotacao}>
          <Text style={styles.tituloAnotacao}>ANOTAÇÃO PESSOAL</Text>
          <CampoTexto
            value={vm.anotacao}
            onChangeText={vm.setAnotacao}
            placeholder="O que você está achando? Alguma meta para este jogo?"
            accessibilityLabel="Anotação pessoal"
            multiline
            maxLength={500}
          />
          {vm.erro ? (
            <Text accessibilityRole="alert" style={styles.erro}>
              {vm.erro}
            </Text>
          ) : null}
        </View>
      </ScrollView>

      {/* Barra de baixo */}
      <View style={[styles.rodape, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          accessibilityRole="button"
          onPress={vm.abrirPainel}
          style={({ pressed }) => [
            estilosGlobais.botaoContorno,
            styles.botaoContorno,
            styles.botaoRodape,
            pressed && estilosGlobais.pressionado,
          ]}
        >
          <Ionicons name="swap-horizontal" size={18} color={cores.texto} />
          <Text style={estilosGlobais.textoBotaoContorno}>Mudar status</Text>
        </Pressable>
        <PrimaryButton
          title="Salvar"
          onPress={() => void aoSalvar()}
          loading={vm.salvando}
          style={styles.botaoRodape}
        />
      </View>

      <PainelMudarStatus
        item={item}
        visivel={vm.painelAberto}
        onFechar={vm.fecharPainel}
        // "Concluir jogo" sempre passa pela tela de conclusão, que pede a nota.
        onConcluir={(jogo) =>
          navigation.navigate("ConcluirJogo", { id: jogo.id })
        }
      />
    </KeyboardAvoidingView>
  );
}
