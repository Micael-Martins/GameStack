import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import BarraProgresso from '../../../../components/BarraProgresso';
import Capa from '../../../../components/Capa';
import { prepararDadosCardJogo } from '../../../../components/utils/cardJogoUtils';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import StatusChip from '../../../../components/StatusChip';
import type { JogoBiblioteca } from '../../../../models/JogoBiblioteca';
import { bordas, cores, estilosGlobais, tipografia } from '../../../../theme';
import { horasInteiras } from '../../../../utils/formatarHoras';

type Props = {
  item: JogoBiblioteca;
  largura?: number; // no carrossel, cada card tem largura fixa
  onRegistrarHoras: () => void;
  onAbrir: () => void; // tocar na capa ou no nome abre os Detalhes
};

// Card grande de um jogo em andamento ("Jogando agora").
export function CardDestaque({ item, largura, onRegistrarHoras, onAbrir }: Props) {
  const dados = prepararDadosCardJogo(item);

  return (
    <View style={[styles.card, largura ? { width: largura } : null]}>
      <Pressable
        onPress={onAbrir}
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${item.jogo.nome}`}
        style={({ pressed }) => [styles.topo, pressed && estilosGlobais.pressionado]}
      >
        <Capa imagemURL={item.jogo.imagemURL} tamanho="G" descricao={`Capa de ${item.jogo.nome}`} />
        <View style={styles.info}>
          <StatusChip status={item.status} />
          <Text style={styles.nome} numberOfLines={2}>
            {item.jogo.nome}
          </Text>
          {dados.plataformaGenero ? (
            <Text style={styles.detalhes} numberOfLines={1}>
              {dados.plataformaGenero}
            </Text>
          ) : null}
        </View>
      </Pressable>

      <View style={styles.progresso}>
        <View style={styles.textosProgresso}>
          <Text style={styles.horas}>{horasInteiras(item.minutosJogados)}h jogadas</Text>
          {item.jogo.tempoMedio > 0 ? <Text style={styles.total}>~{item.jogo.tempoMedio}h no total</Text> : null}
        </View>
        <BarraProgresso
          valor={dados.progresso}
          temTempoMedio={dados.mostrarBarra}
          descricao={`Progresso de ${item.jogo.nome}: ${dados.textoHoras}`}
        />
      </View>

      <PrimaryButton title="Registrar horas" onPress={onRegistrarHoras} />
    </View>
  );
}

// Visual do card (fundo, borda e cantos), reaproveitado pelo carrossel no caso "nenhum jogando".
export const estiloCardDestaque: ViewStyle = {
  backgroundColor: cores.card,
  borderWidth: bordas.fina,
  borderColor: cores.borda,
  borderRadius: 20,
  padding: 16,
  gap: 14,
};

const styles = StyleSheet.create({
  card: estiloCardDestaque,
  topo: { flexDirection: 'row', gap: 14 },
  info: { flex: 1, minWidth: 0, gap: 6, alignItems: 'flex-start' },
  nome: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 19, lineHeight: 24 },
  detalhes: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  progresso: { gap: 6 },
  textosProgresso: { flexDirection: 'row', justifyContent: 'space-between' },
  horas: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 13 },
  total: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});
