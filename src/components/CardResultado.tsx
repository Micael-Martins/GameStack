import { Ionicons } from "@expo/vector-icons";
import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import type { Jogo } from "../models/Jogo";
import { bordas, cores, espacamentos, tipografia } from "../theme";
import { linhaResultado, textoTempoMedio } from "../utils/cardResultadoUtils";
import { EntradaAnimada, ToqueAnimado } from "./animacoes";
import Capa from "./Capa";

type CardResultadoProps = {
  jogo: Jogo;
  naBiblioteca: boolean;
  // Tocar em qualquer parte do card: abre Adicionar (ou Detalhes, se já estiver na biblioteca).
  onTocar: (jogo: Jogo) => void;
};

// Card de um jogo vindo da RAWG (ainda não salvo): mostra ano e tempo médio em
// vez de status e horas. Diferente do CardJogo, que é de um jogo da biblioteca.
function CardResultado({ jogo, naBiblioteca, onTocar }: CardResultadoProps) {
  const tempoMedio = textoTempoMedio(jogo.tempoMedio);
  const detalhes = linhaResultado(jogo);

  return (
    <ToqueAnimado
      onPress={() => onTocar(jogo)}
      accessibilityRole="button"
      accessibilityLabel={
        naBiblioteca
          ? `${jogo.nome}, já na biblioteca. Ver detalhes`
          : `${jogo.nome}. Ver e adicionar`
      }
      style={styles.card}
    >
      <Capa
        imagemURL={jogo.imagemURL}
        tamanho="M"
        descricao={`Capa de ${jogo.nome}`}
      />

      <View style={styles.textos}>
        <Text style={styles.nome} numberOfLines={2}>
          {jogo.nome}
        </Text>
        {detalhes ? (
          <Text style={styles.detalhes} numberOfLines={1}>
            {detalhes}
          </Text>
        ) : null}
        {tempoMedio ? (
          <View style={styles.linhaTempo}>
            <Ionicons
              name="time-outline"
              size={14}
              color={cores.textoSecundario}
            />
            <Text style={styles.detalhes}>{tempoMedio}</Text>
          </View>
        ) : null}
      </View>

      {naBiblioteca ? (
        <EntradaAnimada key="na-biblioteca" deslocamento={0}>
          <View style={styles.naBiblioteca}>
            <Ionicons
              name="checkmark"
              size={15}
              color={cores.textoSecundario}
            />
            <Text style={styles.textoNaBiblioteca}>Na biblioteca</Text>
          </View>
        </EntradaAnimada>
      ) : (
        // O "+" virou só uma pista visual: o card inteiro é o botão.
        <View style={styles.botaoMais}>
          <Ionicons name="add" size={24} color={cores.texto} />
        </View>
      )}
    </ToqueAnimado>
  );
}

// memo: a lista não redesenha os cards que não mudaram.
export default memo(CardResultado);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: espacamentos.m,
    borderRadius: bordas.raios.cards,
    borderWidth: bordas.fina,
    borderColor: cores.borda,
    backgroundColor: cores.card,
  },
  textos: { flex: 1, minWidth: 0, gap: 3 },
  nome: {
    color: cores.texto,
    fontFamily: tipografia.fontes.extraBold,
    fontSize: 16,
    lineHeight: 21,
  },
  detalhes: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.regular,
    fontSize: 13,
  },
  linhaTempo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 1,
  },
  botaoMais: {
    width: 44,
    height: 44,
    borderRadius: bordas.raios.pequeno,
    backgroundColor: cores.borda,
    alignItems: "center",
    justifyContent: "center",
  },
  naBiblioteca: { flexDirection: "row", alignItems: "center", gap: 4 },
  textoNaBiblioteca: {
    color: cores.textoSecundario,
    fontFamily: tipografia.fontes.semiBold,
    fontSize: 13,
  },
});
