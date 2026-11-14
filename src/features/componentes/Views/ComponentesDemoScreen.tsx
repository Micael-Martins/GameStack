import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { cores, espacamentos, tipografia } from '../../../theme';
import BarraProgresso from '../../../views/components/BarraProgresso';
import Capa from '../../../views/components/Capa';
import Estrelas from '../../../views/components/Estrelas';

// PNG local em memória: a demonstração de sucesso não depende de uma API ou rede.
const capaValida = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAADETxJQAAAAE0lEQVR4nGO0aYhgAAMmCIWDBQAppAEcKAfBkgAAAABJRU5ErkJggg==';
const capaQuebrada = 'https://example.invalid/capa-inexistente.png';
const exemplosProgresso = [
  { rotulo: '0%', valor: 0 },
  { rotulo: '50%', valor: 0.5 },
  { rotulo: '100%', valor: 1 },
  { rotulo: 'Acima de 100%: limitado', valor: 1.5 },
  { rotulo: 'Negativo: limitado a zero', valor: -0.2 },
  { rotulo: 'Valor inválido: zero', valor: Number.NaN },
];

/** Catálogo manual do cartão #6, exposto apenas pela aba de desenvolvimento. */
export default function ComponentesDemoScreen() {
  const [nota, setNota] = useState<number | null>(null);
  const [usarCapaValida, setUsarCapaValida] = useState(false);

  return (
    <SafeAreaView style={styles.tela} edges={['top']}>
      <ScrollView contentContainerStyle={styles.conteudo}>
        <Text style={styles.titulo}>Componentes de jogo</Text>
        <Text style={styles.descricao}>Catálogo de desenvolvimento · cartão #6</Text>

        <View style={styles.card}>
          <Text style={styles.secao}>CAPAS · P / M / G</Text>
          <View style={styles.linhaCapas}>
            <Capa imagemURL={capaValida} tamanho="P" descricao="Capa pequena" />
            <Capa imagemURL={capaValida} tamanho="M" descricao="Capa média" />
            <Capa imagemURL={capaValida} tamanho="G" descricao="Capa grande" />
          </View>
          <Text style={styles.legenda}>Larguras de 44, 60 e 100 px; proporção 3:4.</Text>
          <View style={styles.linhaCapas}>
            <View style={styles.exemploCapa}>
              <Capa imagemURL={null} descricao="Capa sem URL" />
              <Text style={styles.legenda}>Sem URL</Text>
            </View>
            <View style={styles.exemploCapa}>
              <Capa imagemURL={usarCapaValida ? capaValida : capaQuebrada} descricao="Capa de teste" />
              <Text style={styles.legenda}>{usarCapaValida ? 'URL válida' : 'URL quebrada'}</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => setUsarCapaValida((valor) => !valor)}
            style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
          >
            <Text style={styles.textoBotao}>{usarCapaValida ? 'Testar URL quebrada' : 'Trocar por URL válida'}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.secao}>PROGRESSO · 8 PX E 5 PX</Text>
          {exemplosProgresso.map(({ rotulo, valor }) => (
            <View key={rotulo} style={styles.exemploProgresso}>
              <Text style={styles.legenda}>{rotulo}</Text>
              <BarraProgresso valor={valor} temTempoMedio descricao={`Progresso normal: ${rotulo}`} />
              <BarraProgresso valor={valor} temTempoMedio variante="fina" descricao={`Progresso fino: ${rotulo}`} />
            </View>
          ))}
          <Text style={styles.legenda}>Sem tempo médio: nenhuma barra abaixo deste texto.</Text>
          <BarraProgresso valor={0.5} temTempoMedio={false} />
        </View>

        <View style={styles.card}>
          <Text style={styles.secao}>AVALIAÇÃO</Text>
          <Text style={styles.legenda}>Leitura: sem avaliação e três estrelas</Text>
          <Estrelas nota={null} />
          <Estrelas nota={3} />
          <Text style={styles.legenda}>Toque para avaliar</Text>
          <Estrelas nota={nota} onChange={setNota} />
          <Text style={styles.descricao} accessibilityLiveRegion="polite">
            {nota === null ? 'Sem avaliação' : `Nota selecionada: ${nota}`}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: espacamentos.gg, gap: espacamentos.g, paddingBottom: 32 },
  titulo: { color: cores.texto, fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 26 },
  descricao: { color: cores.textoSecundario, fontFamily: tipografia.fonte, fontSize: 14 },
  card: {
    padding: espacamentos.g,
    gap: espacamentos.m,
    backgroundColor: cores.card,
    borderColor: cores.borda,
    borderWidth: 1,
    borderRadius: espacamentos.raios.cards,
  },
  secao: { color: cores.textoSecundario, fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 12 },
  legenda: { color: cores.textoSecundario, fontFamily: tipografia.fonte, fontSize: 12 },
  linhaCapas: { flexDirection: 'row', gap: espacamentos.g, alignItems: 'flex-end' },
  exemploCapa: { gap: espacamentos.p, alignItems: 'center' },
  exemploProgresso: { gap: espacamentos.p },
  botao: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacamentos.m,
    borderColor: cores.texto,
    borderWidth: 1,
    borderRadius: espacamentos.raios.botoes,
  },
  textoBotao: { color: cores.texto, fontFamily: 'PlusJakartaSans_600SemiBold', fontSize: 13 },
  pressionado: { opacity: 0.6 },
});
