import { Ionicons } from '@expo/vector-icons';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Estrelas from '../../../components/Estrelas';
import { PrimaryButton } from '../../../components/PrimaryButton';
import StatusChip from '../../../components/StatusChip';
import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import { cores, espacamentos, tipografia } from '../../../theme';
import {
  aceitaAvaliacao,
  OPCOES_PAINEL_STATUS,
} from '../Model/opcoesPainelStatus';
import { usePainelMudarStatusViewModel } from '../ViewModel/usePainelMudarStatusViewModel';

export interface PainelMudarStatusProps {
  item: JogoBiblioteca | null;
  visivel: boolean;
  onFechar: () => void;
  onSalvo?: () => void;
}

export default function PainelMudarStatus({
  item,
  visivel,
  onFechar,
  onSalvo,
}: PainelMudarStatusProps) {
  const insets = useSafeAreaInsets();

  const vm = usePainelMudarStatusViewModel(
    item,
    visivel,
    onFechar,
    onSalvo,
  );

  const fechar = () => {
    if (!vm.salvando) onFechar();
  };

  if (!vm.jogoAtual) return null;

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={fechar}
    >
      <View style={styles.area}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar painel"
          onPress={fechar}
          disabled={vm.salvando}
          style={[StyleSheet.absoluteFill, styles.fundo]}
        />

        <View
          style={[
            styles.painel,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <ScrollView
            contentContainerStyle={styles.conteudo}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topo}>
              <Text style={styles.titulo}>Mudar status</Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Fechar"
                onPress={fechar}
                disabled={vm.salvando}
                style={styles.fechar}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={cores.texto}
                />
              </Pressable>
            </View>

            <Text style={styles.nomeJogo} numberOfLines={2}>
              {vm.jogoAtual.jogo.nome}
            </Text>

            <View style={styles.statusAtual}>
              <Text style={styles.textoSecundario}>
                Status atual
              </Text>
              <StatusChip status={vm.jogoAtual.status} />
            </View>

            <Text style={styles.tituloSecao}>
              Escolha o novo status
            </Text>

            {OPCOES_PAINEL_STATUS.map((opcao) => {
              const selecionada =
                vm.statusSelecionado === opcao.status;

              return (
                <Pressable
                  key={opcao.status}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar ${opcao.titulo}`}
                  accessibilityState={{
                    selected: selecionada,
                    disabled: vm.salvando,
                  }}
                  disabled={vm.salvando}
                  onPress={() => vm.selecionarStatus(opcao.status)}
                  style={({ pressed }) => [
                    styles.opcao,
                    selecionada && styles.opcaoSelecionada,
                    pressed && styles.pressionado,
                  ]}
                >
                  <View style={styles.opcaoTextos}>
                    <Text style={styles.opcaoTitulo}>
                      {opcao.titulo}
                    </Text>
                    <Text style={styles.opcaoDescricao}>
                      {opcao.descricao}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.radio,
                      selecionada && styles.radioSelecionado,
                    ]}
                  >
                    {selecionada ? (
                      <View style={styles.radioInterno} />
                    ) : null}
                  </View>
                </Pressable>
              );
            })}

            {aceitaAvaliacao(vm.statusSelecionado) ? (
              <View style={styles.avaliacao}>
                <Text style={styles.tituloSecao}>
                  Avaliação (opcional)
                </Text>
                <Estrelas
                  nota={vm.notaSelecionada}
                  onChange={vm.selecionarNota}
                />
              </View>
            ) : null}

            {vm.erro ? (
              <Text accessibilityRole="alert" style={styles.erro}>
                {vm.erro}
              </Text>
            ) : null}

            <View style={styles.rodape}>
              <Pressable
                accessibilityRole="button"
                onPress={fechar}
                disabled={vm.salvando}
                style={styles.cancelar}
              >
                <Text style={styles.cancelarTexto}>
                  Cancelar
                </Text>
              </Pressable>

              <PrimaryButton
                title="Salvar status"
                onPress={() => void vm.confirmar()}
                loading={vm.salvando}
                disabled={!vm.podeConfirmar}
                style={styles.salvar}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  fundo: {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  painel: {
    maxHeight: '90%',
    backgroundColor: cores.card,
    borderTopLeftRadius: espacamentos.raios.cards,
    borderTopRightRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  conteudo: {
    padding: espacamentos.gg,
    gap: espacamentos.m,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 22,
  },
  fechar: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nomeJogo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 16,
  },
  statusAtual: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: espacamentos.m,
    marginBottom: espacamentos.p,
  },
  textoSecundario: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
  tituloSecao: {
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: tipografia.tamanhos.corpo,
  },
  opcao: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: espacamentos.g,
    borderRadius: espacamentos.raios.botoes,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
    gap: espacamentos.m,
  },
  opcaoSelecionada: {
    borderColor: cores.texto,
  },
  pressionado: {
    opacity: 0.7,
  },
  opcaoTextos: {
    flex: 1,
    gap: 4,
  },
  opcaoTitulo: {
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 15,
  },
  opcaoDescricao: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 12,
  },
  radio: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: cores.textoSecundario,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelecionado: {
    borderColor: cores.texto,
  },
  radioInterno: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: cores.texto,
  },
  avaliacao: {
    gap: espacamentos.p,
    marginTop: espacamentos.p,
  },
  erro: {
    color: cores.texto,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    marginTop: espacamentos.p,
  },
  cancelar: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: espacamentos.g,
  },
  cancelarTexto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 14,
  },
  salvar: {
    flex: 1,
  },
});
