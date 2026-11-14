import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from 'react-native';

import { cores } from '../theme';
import { styles } from './PrimaryButton.styles';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean; 
  disabled?: boolean;
  style?: StyleProp<ViewStyle>; 
};

export function PrimaryButton({ title, onPress, loading = false, disabled = false, style }: Props) {
  const inactive = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        inactive && styles.inactive,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={cores.fundo} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}