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
import { OnBoardingIllustration } from './IlustracaoBoasVindas';

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
            <Text style={styles.title}>GameStack</Text>
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

