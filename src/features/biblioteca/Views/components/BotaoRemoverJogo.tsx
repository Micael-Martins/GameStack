import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { JogoBiblioteca } from '../../../../models/JogoBiblioteca';
import { bordas, cores } from '../../../../theme';
import { textoConfirmacaoRemocao } from '../../Model/remocaoJogo';
import { useBotaoRemoverViewModel } from '../../ViewModel/useBotaoRemoverViewModel';

// Lixeira da tela Detalhes: pede confirmação e remove o jogo da biblioteca.
export interface BotaoRemoverJogoProps {
  item: JogoBiblioteca;
  onRemovido: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BotaoRemoverJogo({
  item,
  onRemovido,
  style,
}: BotaoRemoverJogoProps) {
  const vm = useBotaoRemoverViewModel(item.id, onRemovido);

  async function executarRemocao(): Promise<void> {
    const sucesso = await vm.removerConfirmado();

    if (!sucesso) {
      const mensagem = 'Não foi possível remover o jogo. Tente novamente.';

      if (Platform.OS === 'web') {
        window.alert(mensagem);
      } else {
        Alert.alert('Erro ao remover', mensagem);
      }
    }
  }

  // Na web não existe Alert com botões, então usa o confirm do navegador
  function solicitarConfirmacao(): void {
    if (vm.removendo) return;

    const texto = textoConfirmacaoRemocao(item.jogo.nome);

    if (Platform.OS === 'web') {
      const confirmou = window.confirm(
        `${texto.titulo}\n\n${texto.mensagem}`,
      );

      if (confirmou) {
        void executarRemocao();
      }

      return;
    }

    Alert.alert(texto.titulo, texto.mensagem, [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: () => {
          void executarRemocao();
        },
      },
    ]);
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Remover da biblioteca"
      accessibilityHint="Solicita confirmação antes de remover o jogo"
      accessibilityState={{
        disabled: vm.removendo,
        busy: vm.removendo,
      }}
      disabled={vm.removendo}
      onPress={solicitarConfirmacao}
      style={({ pressed }) => [
        styles.botao,
        style,
        pressed && styles.pressionado,
        vm.removendo && styles.desabilitado,
      ]}
    >
      {vm.removendo ? (
        <ActivityIndicator color={cores.texto} />
      ) : (
        <Ionicons
          name="trash-outline"
          size={22}
          color={cores.texto}
          accessible={false}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: bordas.raios.pequeno,
  },
  pressionado: {
    backgroundColor: cores.borda,
  },
  desabilitado: {
    opacity: 0.5,
  },
});
