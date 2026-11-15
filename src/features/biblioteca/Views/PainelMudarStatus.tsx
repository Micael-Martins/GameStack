import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import { cores, espacamentos, tipografia } from '../../../theme';
import { nomeDoStatus, OPCOES_PAINEL_STATUS } from '../Model/opcoesPainelStatus';
import { usePainelMudarStatusViewModel } from '../ViewModel/usePainelMudarStatusViewModel';

export interface PainelMudarStatusProps {
  item: JogoBiblioteca | null;
  visivel: boolean;
  onFechar: () => void;
  // "Concluir jogo": quem abre o painel (tela Detalhes) navega para a tela Concluir jogo.
  onConcluir: (item: JogoBiblioteca) => void;
}

// Painel que sobe de baixo ao tocar em "Mudar status" na tela Detalhes.
export default function PainelMudarStatus({ item, visivel, onFechar, onConcluir }: PainelMudarStatusProps) {
  const insets = useSafeAreaInsets();
  const vm = usePainelMudarStatusViewModel(item, visivel, onFechar, onConcluir);

  const fechar = () => {
    if (!vm.salvando) onFechar();
  };

  if (!vm.jogoAtual) return null;

  return (
    // onRequestClose = botão voltar do Android
    <Modal visible={visivel} transparent animationType="slide" onRequestClose={fechar}>
      <View style={styles.area}>
        {/* Tocar fora do painel fecha */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar painel"
          onPress={fechar}
          style={[StyleSheet.absoluteFill, styles.fundo]}
        />

        <View style={[styles.painel, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <View style={styles.alca} />

          <View>
            <Text style={styles.titulo}>Mudar status</Text>
            <Text style={styles.agora} numberOfLines={1}>
              {vm.jogoAtual.jogo.nome} · Agora: {nomeDoStatus(vm.jogoAtual.status)}
            </Text>
          </View>

          <View style={styles.opcoes}>
            {OPCOES_PAINEL_STATUS.map((opcao) => {
              const atual = vm.jogoAtual?.status === opcao.status;
              const salvandoEsta = vm.salvandoStatus === opcao.status;
              const destaque = opcao.destaque && !atual;
              const corTexto = destaque ? cores.fundo : cores.texto;
              const corDescricao = destaque ? '#404040' : cores.textoSecundario;

              return (
                <Pressable
                  key={opcao.status}
                  accessibilityRole="button"
                  accessibilityLabel={opcao.titulo}
                  accessibilityHint={opcao.descricao}
                  accessibilityState={{ selected: atual, disabled: atual || vm.salvando }}
                  disabled={atual || vm.salvando}
                  onPress={() => void vm.escolher(opcao.status)}
                  style={({ pressed }) => [
                    styles.opcao,
                    destaque && styles.opcaoDestaque,
                    atual && styles.opcaoAtual,
                    pressed && styles.pressionado,
                  ]}
                >
                  <View style={styles.opcaoTextos}>
                    <Text style={[styles.opcaoTitulo, { color: corTexto }]}>{opcao.titulo}</Text>
                    <Text style={[styles.opcaoDescricao, { color: corDescricao }]}>
                      {atual ? 'Status atual' : opcao.descricao}
                    </Text>
                  </View>

                  {/* Check no status atual; carregando na opção que está salvando */}
                  {salvandoEsta ? (
                    <ActivityIndicator color={corTexto} />
                  ) : atual ? (
                    <Ionicons name="checkmark-circle" size={24} color={cores.texto} />
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={corDescricao} />
                  )}
                </Pressable>
              );
            })}
          </View>

          {vm.erro ? (
            <Text accessibilityRole="alert" style={styles.erro}>
              {vm.erro}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, justifyContent: 'flex-end' },
  fundo: { backgroundColor: 'rgba(0, 0, 0, 0.72)' },
  painel: {
    backgroundColor: cores.card,
    borderTopLeftRadius: espacamentos.raios.cards,
    borderTopRightRadius: espacamentos.raios.cards,
    borderWidth: 1,
    borderColor: cores.borda,
    paddingHorizontal: espacamentos.gg,
    paddingTop: 10,
    gap: espacamentos.g,
  },
  alca: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: '#3A3A3A' },
  titulo: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 22 },
  agora: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 14, marginTop: 4 },
  opcoes: { gap: 10 },
  opcao: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacamentos.m,
    padding: espacamentos.g,
    borderRadius: espacamentos.raios.botoes,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.fundo,
  },
  opcaoDestaque: { backgroundColor: cores.texto, borderColor: cores.texto },
  opcaoAtual: { borderColor: cores.texto },
  pressionado: { opacity: 0.7 },
  opcaoTextos: { flex: 1, gap: 3 },
  opcaoTitulo: { fontFamily: tipografia.fontes.semiBold, fontSize: 15 },
  opcaoDescricao: { fontFamily: tipografia.fontes.regular, fontSize: 12 },
  erro: { color: cores.texto, fontFamily: tipografia.fontes.regular, fontSize: 13, textAlign: 'center' },
});