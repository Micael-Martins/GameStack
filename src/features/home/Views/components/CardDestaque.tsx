import { StyleSheet, Text, View, type ViewStyle } from 'react-native';

import BarraProgresso from '../../../../components/BarraProgresso';
import Capa from '../../../../components/Capa';
import { prepararDadosCardJogo } from '../../../../components/cardJogoUtils';
import { PrimaryButton } from '../../../../components/PrimaryButton';
import StatusChip from '../../../../components/StatusChip';
import type { JogoBiblioteca } from '../../../../models/JogoBiblioteca';
import { cores, tipografia } from '../../../../theme';
import { horasInteiras } from '../../../../utils/formatarHoras';

type Props = {
  game: JogoBiblioteca;
  width?: number; // no carrossel, cada card tem largura fixa
  onLogHours: () => void;
};

export function NowPlayingCard({ game, width, onLogHours }: Props) {
  const data = prepararDadosCardJogo(game);

  return (
    <View style={[styles.card, width ? { width } : null]}>
      <View style={styles.top}>
        <Capa imagemURL={game.jogo.imagemURL} tamanho="G" descricao={`Capa de ${game.jogo.nome}`} />
        <View style={styles.info}>
          <StatusChip status={game.status} />
          <Text style={styles.title} numberOfLines={2}>
            {game.jogo.nome}
          </Text>
          {data.plataformaGenero ? (
            <Text style={styles.details} numberOfLines={1}>
              {data.plataformaGenero}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressTexts}>
          <Text style={styles.hours}>{horasInteiras(game.minutosJogados)}h jogadas</Text>
          {game.jogo.tempoMedio > 0 ? <Text style={styles.total}>~{game.jogo.tempoMedio}h no total</Text> : null}
        </View>
        <BarraProgresso
          valor={data.progresso}
          temTempoMedio={data.mostrarBarra}
          descricao={`Progresso de ${game.jogo.nome}: ${data.textoHoras}`}
        />
      </View>

      <PrimaryButton title="Registrar horas" onPress={onLogHours} />
    </View>
  );
}

export const nowPlayingCardStyle: ViewStyle = {
  backgroundColor: cores.card,
  borderWidth: 1,
  borderColor: cores.borda,
  borderRadius: 20,
  padding: 16,
  gap: 14,
};

const styles = StyleSheet.create({
  card: nowPlayingCardStyle,
  top: { flexDirection: 'row', gap: 14 },
  info: { flex: 1, minWidth: 0, gap: 6, alignItems: 'flex-start' },
  title: { color: cores.texto, fontFamily: tipografia.fontes.extraBold, fontSize: 19, lineHeight: 24 },
  details: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
  progress: { gap: 6 },
  progressTexts: { flexDirection: 'row', justifyContent: 'space-between' },
  hours: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 13 },
  total: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 13 },
});