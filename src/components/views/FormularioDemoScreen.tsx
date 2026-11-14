import { RootStackParamList } from '@/src/navigation/tipos';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Cabecalho from '../Cabecalho';
import TituloSecao from '../TituloSecao';
import CampoTexto from '../CampoTexto';
import { cores, tipografia } from '@/src/theme';
import Interruptor from '../Interruptor';


type Props = NativeStackScreenProps<RootStackParamList, 'FormularioDemo'>;

export default function FormularioDemoScreen({ navigation }: Props) {
  // Estado apenas demonstrativo: os componentes não conhecem persistência ou regras do produto.
  const [nome, setNome] = useState('');
  const [horas, setHoras] = useState('');
  const [anotacao, setAnotacao] = useState('');
  const [lembrete, setLembrete] = useState(true);
  const [mensagem, setMensagem] = useState('Toque em Ver todos ou na ação do cabeçalho.');
  return <SafeAreaView style={styles.tela}>
    <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Cabecalho titulo="Componentes" subtitulo="Formulário e estrutura" onVoltar={() => navigation.replace('Abas')}
        acaoDireita={<Pressable accessibilityRole="button" accessibilityLabel="Testar ação do cabeçalho" style={styles.acao} onPress={() => setMensagem('Ação do cabeçalho acionada.')}><Text style={styles.texto}>⋯</Text></Pressable>} />
      <TituloSecao titulo="Perfil" link={{ texto: 'Ver todos', onPress: () => setMensagem('Link da seção acionado.') }} />
      <CampoTexto label="Nome" placeholder="Seu nome" value={nome} onChangeText={setNome} />
      <CampoTexto label="Quanto você já jogou?" placeholder="0" sufixo="horas" keyboardType="decimal-pad" value={horas} onChangeText={setHoras} />
      <CampoTexto label="O que você achou?" placeholder="Sua anotação pessoal" multiline value={anotacao} onChangeText={setAnotacao} />
      <TituloSecao titulo="Lembretes" />
      <View style={styles.linha}><Text style={styles.texto}>Lembretes ativos</Text><Interruptor value={lembrete} onValueChange={setLembrete} accessibilityLabel="Lembretes ativos" /></View>
      <View style={styles.linha}><Text style={styles.texto}>Desligado e desabilitado</Text><Interruptor value={false} onValueChange={() => undefined} disabled accessibilityLabel="Exemplo desabilitado" /></View>
      <Text accessibilityLiveRegion="polite" style={styles.legenda}>{mensagem}</Text>
    </ScrollView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: 20, gap: 16 },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: cores.card, padding: 12, borderRadius: 12 },
  texto: { color: cores.texto, fontFamily: tipografia.fonte, flexShrink: 1 },
  legenda: { color: cores.textoSecundario, fontFamily: tipografia.fonte },
  acao: { minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' },
});
