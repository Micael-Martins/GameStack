import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { JogoBiblioteca } from '../models/JogoBiblioteca';
import { prepararDadosCardJogo } from '../features/biblioteca/ViewModel/cardJogoUtils';
import { cores, espacamentos, tipografia } from '../theme';

import BarraProgresso from './BarraProgresso';
import Capa from './Capa';
import Estrelas from './Estrelas';
import StatusChip from './StatusChip';

export interface CardJogoProps {
  item: JogoBiblioteca;
  variante?: 'normal' | 'compacto';
  onPress?: (item: JogoBiblioteca) => void;
}

/**
 * Cartão visual reutilizável da biblioteca.
 * Não consulta a API e não modifica o banco de dados.
 */
export default function CardJogo({
  item,
  variante = 'normal',
  onPress,
}: CardJogoProps) {
  const compacto = variante === 'compacto';
  const dados = prepararDadosCardJogo(item);

  const mostrarProgresso =
    dados.temTempoMedio &&
    (item.minutosJogados > 0 || item.status === 'JOGANDO');

  const conteudo = (
    <View
      style={[
        styles.card,
        compacto ? styles.cardCompacto : styles.cardNormal,
      ]}
    >
      <Capa
        imagemURL={item.jogo.imagemURL}
        tamanho={compacto ? 'P' : 'M'}
        descricao={`Capa de ${item.jogo.nome}`}
      />

      <View style={styles.informacoes}>
        <Text
          numberOfLines={compacto ? 1 : 2}
          style={[
            styles.nome,
            compacto && styles.nomeCompacto,
          ]}
        >
          {item.jogo.nome}
        </Text>

        {compacto ? (
          <View style={styles.linhaCompacta}>
            <StatusChip status={item.status} />

            {item.minutosJogados > 0 ? (
              <Text style={styles.tempoCompacto}>
                {dados.tempoJogado}
              </Text>
            ) : null}
          </View>
        ) : (
          <>
            {dados.resumo ? (
              <Text
                numberOfLines={1}
                style={styles.resumo}
              >
                {dados.resumo}
              </Text>
            ) : null}

            <View style={styles.linhaStatus}>
              <StatusChip status={item.status} />

              {item.nota != null ? (
                <Estrelas nota={item.nota} />
              ) : null}
            </View>

            {mostrarProgresso || item.minutosJogados > 0 ? (
              <View style={styles.areaProgresso}>
                {mostrarProgresso ? (
                  <BarraProgresso
                    valor={dados.progresso}
                    temTempoMedio={dados.temTempoMedio}
                    variante="fina"
                    descricao={`Progresso de ${item.jogo.nome}`}
                  />
                ) : null}

                <View style={styles.rodape}>
                  <Text style={styles.textoSecundario}>
                    {dados.tempoJogado} jogados
                  </Text>

                  {mostrarProgresso ? (
                    <Text style={styles.textoSecundario}>
                      {dados.percentual}%
                    </Text>
                  ) : null}
                </View>
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );

  // Sem callback, o cartão é somente informativo.
  if (!onPress) {
    return conteudo;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalhes de ${item.jogo.nome}`}
      onPress={() => onPress(item)}
      style={({ pressed }) => [
        styles.areaToque,
        pressed && styles.pressionado,
      ]}
    >
      {conteudo}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  areaToque: {
    width: '100%',
  },

  pressionado: {
    opacity: 0.7,
  },

  card: {
    width: '100%',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: espacamentos.raios.cards,
    backgroundColor: cores.card,
  },

  cardNormal: {
    alignItems: 'flex-start',
    padding: espacamentos.m,
    gap: espacamentos.m,
    minHeight: 110,
  },

  cardCompacto: {
    alignItems: 'center',
    padding: espacamentos.p,
    gap: espacamentos.m,
    minHeight: 76,
  },

  informacoes: {
    flex: 1,
    minWidth: 0,
    gap: espacamentos.p,
  },

  nome: {
    color: cores.texto,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 16,
    lineHeight: 23,
  },

  nomeCompacto: {
    fontSize: 14,
    lineHeight: 19,
  },

  resumo: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },

  linhaStatus: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: espacamentos.p,
  },

  linhaCompacta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: espacamentos.p,
  },

  tempoCompacto: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 11,
  },

  areaProgresso: {
    width: '100%',
    gap: espacamentos.p,
  },

  rodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espacamentos.p,
  },

  textoSecundario: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: tipografia.tamanhos.legenda,
  },
});
