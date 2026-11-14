import { Ionicons } from '@expo/vector-icons'; // novo
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar'; // novo
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../navigation/tipos';
import { cores, tipografia } from '../../../theme';
import { useOnBoardingViewModel } from '../ViewModel/useOnBoardingViewModel';
import { styles } from './OnBoardingScreen.styles';
import { PrimaryButton } from '@/src/components/PrimaryButton';

type Props = NativeStackScreenProps<RootStackParamList, 'BoasVindas'>;

export default function OnBoardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const vm = useOnBoardingViewModel(() => navigation.replace('Abas'));

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" bounces={false}>
        <Illustration top={insets.top} covers={vm.covers} />

        <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.texts}>
            <Text style={styles.title}>Bem-vindo ao GameStack</Text>
            <Text style={styles.subtitle}>Termine o que começou antes de começar o próximo jogo.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>
  Como podemos te chamar? <Text style={styles.optional}>(opcional)</Text>
</Text>
            <TextInput
              style={styles.input}
              value={vm.name}
              onChangeText={vm.setName}
              placeholder="Seu nome"
              placeholderTextColor={cores.textoFraco}
              autoCapitalize="words"
              returnKeyType="done"
              maxLength={30}
              accessibilityLabelledBy="nameLabel"
            />
          </View>

           <View style={styles.reminderCard}>
            <View style={styles.reminderTexts}>
              <Text style={styles.reminderTitle}>Lembretes para jogar</Text>
              <Text style={styles.reminderDescription}>Se um jogo ficar 5 dias parado, avisamos.</Text>
            </View>
            <Switch
              value={vm.remindersEnabled}
              onValueChange={vm.setRemindersEnabled}
              trackColor={{ false: '#3A3A3A', true: cores.texto }}
              thumbColor={vm.remindersEnabled ? cores.fundo : cores.texto}
              ios_backgroundColor="#3A3A3A"
              accessibilityLabel="Lembretes para jogar"
            />
          </View>
          {vm.error && <Text style={styles.error}>{vm.error}</Text>}

          <PrimaryButton title="Começar" onPress={vm.start} loading={vm.saving} style={{ marginTop: 8 }} />

          <Text style={styles.footer}>Seus dados ficam só neste aparelho.</Text>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Illustration({ top, covers }: { top: number; covers: string[] }) {
  return (
    <View
      style={[styles.illustration, { paddingTop: top }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.stage}>
        <View style={[styles.cover, styles.coverLeft]}>
          {covers[1] && <Image source={{ uri: covers[1] }} style={styles.coverImage} />}
        </View>
        <View style={[styles.cover, styles.coverRight]}>
          {covers[2] && <Image source={{ uri: covers[2] }} style={styles.coverImage} />}
        </View>
        <View style={[styles.cover, styles.coverCenter]}>
          {covers[0] && <Image source={{ uri: covers[0] }} style={styles.coverImageCenter} />}
          <Text style={styles.playingChip}>• JOGANDO</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <View style={styles.iconBadge}>
          <Ionicons name="game-controller" size={26} color={cores.texto} />
        </View>
        <Text style={[styles.floating, styles.doneChip]}>✓ CONCLUÍDO</Text>
        <Text style={[styles.floating, styles.hoursChip]}>+2h</Text>
        <Text style={[styles.floating, styles.stars]}>★★★★★</Text>
      </View>

      <View style={styles.curve}>
        <View style={styles.curveCircle} />
      </View>
    </View>
  );
}