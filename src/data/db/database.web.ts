import { Platform } from 'react-native';

// Na web o SQLite nativo não roda: os repositórios recebem null e usam valores padrão.
export async function getDb(): Promise<null> {
  if (Platform.OS === 'web') {
    console.warn('SQLite nativo só roda em Android/iOS.');
  }
  return null;
}