import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/src/components/PrimaryButton';
import { RootStackParamList } from '../../../navigation/tipos';
import { cores } from '../../../theme';
import CampoTexto from '../../../components/CampoTexto';
import Interruptor from '../../../components/Interruptor';
import { useOnBoardingViewModel } from '../ViewModel/useOnBoardingViewModel';
import { styles } from './OnBoardingScreen.styles';
import { PopIn } from './PopIn';
import { OnBoardingIllustration } from './OnBoardingIllustration';

type Props = NativeStackScreenProps<RootStackParamList, 'BoasVindas'>;

export default function OnBoardingScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const vm = useOnBoardingViewModel(() => navigation.replace('Abas'));

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" bounces={false}>

<OnBoardingIllustration top={insets.top} covers={vm.covers} />
        <View style={[styles.body, { paddingBottom: insets.bottom + 24 }]}>
          <View style={styles.texts}>
            <Text style={styles.title}>Backlog Zero</Text>
            <Text style={styles.subtitle}>Termine o que começou antes de comprar o próximo jogo.</Text>
          </View>

          <View style={styles.spacer} />

          <CampoTexto
            label="Como podemos te chamar? (opcional)"
            placeholder="Seu nome"
            value={vm.name}
            onChangeText={vm.setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            maxLength={30}
          />

          <View style={styles.reminderCard}>
            <View style={styles.reminderTexts}>
              <Text style={styles.reminderTitle}>Lembretes para jogar</Text>
              <Text style={styles.reminderDescription}>Se um jogo ficar 5 dias parado, avisamos.</Text>
            </View>
            <Interruptor
              value={vm.remindersEnabled}
              onValueChange={vm.setRemindersEnabled}
              accessibilityLabel="Lembretes para jogar"
            />
          </View>

          {vm.error ? <Text style={styles.error}>{vm.error}</Text> : null}

          <PrimaryButton title="Começar" onPress={vm.start} loading={vm.saving} style={{ marginTop: 8 }} />

          <Text style={styles.footer}>Seus dados ficam só neste aparelho</Text>
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
  <PopIn delay={0}>
    <View style={[styles.cover, styles.coverLeft]}>
      {covers[1] && <Image source={{ uri: covers[1] }} style={styles.coverImage} />}
    </View>
  </PopIn>
  <PopIn delay={80}>
    <View style={[styles.cover, styles.coverRight]}>
      {covers[2] && <Image source={{ uri: covers[2] }} style={styles.coverImage} />}
    </View>
  </PopIn>
  <PopIn delay={180}>
    <View style={[styles.cover, styles.coverCenter]}>
      {covers[0] && <Image source={{ uri: covers[0] }} style={styles.coverImageCenter} />}
      <Text style={styles.playingChip}>• JOGANDO</Text>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
    </View>
  </PopIn>

  <PopIn delay={450}>
    <View style={styles.iconBadge}>
      <Ionicons name="game-controller" size={26} color={cores.texto} />
    </View>
  </PopIn>
  <PopIn delay={530}>
    <Text style={[styles.floating, styles.doneChip]}>✓ CONCLUÍDO</Text>
  </PopIn>
  <PopIn delay={610}>
    <Text style={[styles.floating, styles.hoursChip]}>+2h</Text>
  </PopIn>
  <PopIn delay={690}>
    <Text style={[styles.floating, styles.stars]}>★★★★★</Text>
  </PopIn>
</View>

      <View style={styles.curve}>
        <View style={styles.curveCircle} />
      </View>
    </View>
  );
}