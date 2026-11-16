import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { JogoBiblioteca } from '../models/JogoBiblioteca';
import { bordas, cores, espacamentos, estilosGlobais, tipografia } from '../theme';
import BarraProgresso from './BarraProgresso';
import Capa from './Capa';
import { prepararDadosCardJogo } from './utils/cardJogoUtils';
import Estrelas from './Estrelas';
import StatusChip from './StatusChip';

export interface CardJogoProps {
  item: JogoBiblioteca;
  variante?: 'normal' | 'compacto';
  onPress?: (item: JogoBiblioteca) => void;
}

/**
 * Card de um jogo que já está na biblioteca.
 * - normal: Biblioteca (capa M, plataforma · gênero, status, horas, estrelas e barra)
 * - compacto: "Jogados recentemente" na Home (capa P, uma linha de texto, status à direita)
 * Só mostra dados: não consulta a API nem grava no banco.
 */
export default function CardJogo({ item, variante = 'normal', onPress }: CardJogoProps) {
  const dados = prepararDadosCardJogo(item);
  const compacto = variante === 'compacto';

  const conteudo = compacto ? (
    <View style={[styles.card, styles.cardCompacto]}>
      <Capa imagemURL={item.jogo.imagemURL} tamanho="P" descricao={`Capa de ${item.jogo.nome}`} />
      <View style={styles.informacoes}>
        <Text style={styles.nomeCompacto} numberOfLines={1}>
          {item.jogo.nome}
        </Text>
        <Text style={styles.textoSecundario} numberOfLines={1}>
          {dados.linhaCompacta}
        </Text>
      </View>
      <StatusChip status={item.status} />
    </View>
  ) : (
    <View style={[styles.card, styles.cardNormal]}>
      <Capa imagemURL={item.jogo.imagemURL} tamanho="M" descricao={`Capa de ${item.jogo.nome}`} />
      <View style={styles.informacoes}>
        <Text style={styles.nome} numberOfLines={2}>
          {item.jogo.nome}
        </Text>
        {dados.plataformaGenero ? (
          <Text style={styles.textoSecundario} numberOfLines={1}>
            {dados.plataformaGenero}
          </Text>
        ) : null}

        <View style={styles.linhaStatus}>
          <StatusChip status={item.status} />
          <Text style={styles.textoSecundario}>{dados.textoHoras}</Text>
        </View>

        {item.nota != null ? <Estrelas nota={item.nota} /> : null}

        {dados.mostrarBarra ? (
          <BarraProgresso
            valor={dados.progresso}
            temTempoMedio
            variante="fina"
            descricao={`Progresso de ${item.jogo.nome}: ${dados.textoHoras}`}
          />
        ) : null}
      </View>
    </View>
  );

  // Sem onPress, o card é só informativo.
  if (!onPress) return conteudo;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${item.jogo.nome}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => pressed && estilosGlobais.pressionado}
    >
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    borderRadius: bordas.raios.cards,
    backgroundColor: cores.card,
    gap: espacamentos.m,
  },
  cardNormal: { alignItems: 'flex-start', padding: espacamentos.m },
  cardCompacto: { alignItems: 'center', padding: 10 },
  informacoes: { flex: 1, minWidth: 0, gap: 6 },
  nome: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 16, lineHeight: 22 },
  nomeCompacto: { color: cores.texto, fontFamily: tipografia.fontes.semiBold, fontSize: 15 },
  linhaStatus: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: espacamentos.p },
  textoSecundario: { color: cores.textoSecundario, fontFamily: tipografia.fontes.regular, fontSize: 12 },
});