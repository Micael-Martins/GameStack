import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CampoTexto from "../../../components/CampoTexto";
import Interruptor from "../../../components/Interruptor";
import { PrimaryButton } from "../../../components/PrimaryButton";
import { RootStackParamList } from "../../../navigation/tipos";
import { estilosGlobais } from "../../../theme";
import { useBoasVindasViewModel } from "../ViewModel/useBoasVindasViewModel";
import { IlustracaoBoasVindas } from "./components/IlustracaoBoasVindas";
import { styles } from "./styles/BoasVindasScreen.styles";

type Props = NativeStackScreenProps<RootStackParamList, "BoasVindas">;

// Tela de boas-vindas (onboarding): aparece só no primeiro acesso.
export default function BoasVindasScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useBoasVindasViewModel(() => navigation.replace("Abas"));

  return (
    <KeyboardAvoidingView
      style={estilosGlobais.tela}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <IlustracaoBoasVindas topo={insets.top} capas={vm.capas} />

        <View style={[styles.corpo, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.textos}>
            <Text style={styles.titulo}>GameStack</Text>
            <Text style={styles.subtitulo}>
              Termine o que começou antes de comprar o próximo jogo.
            </Text>
          </View>

          <View style={styles.espacador} />

          <CampoTexto
            label="Como podemos te chamar? (opcional)"
            placeholder="Seu nome"
            value={vm.nome}
            onChangeText={vm.setNome}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            maxLength={30}
          />

          <View style={styles.cardLembrete}>
            <View style={styles.textosLembrete}>
              <Text style={styles.tituloLembrete}>Lembretes para jogar</Text>
              <Text style={styles.descricaoLembrete}>
                Se um jogo ficar 5 dias parado, avisamos.
              </Text>
            </View>
            <Interruptor
              value={vm.lembretesAtivos}
              onValueChange={vm.setLembretesAtivos}
              accessibilityLabel="Lembretes para jogar"
            />
          </View>

          {vm.erro ? <Text style={styles.erro}>{vm.erro}</Text> : null}

          <PrimaryButton
            title="Começar"
            onPress={vm.comecar}
            loading={vm.salvando}
            style={styles.botaoComecar}
          />

          <Text style={styles.rodape}>Seus dados ficam só neste aparelho</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
