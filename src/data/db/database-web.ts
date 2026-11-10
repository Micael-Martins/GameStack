import { Platform } from 'react-native';

export const databaseWeb = {
  initDatabase: async () => {
    if (Platform.OS === 'web') {
        console.warn('SQLite nativo só roda em Android/iOS.');
        return null;
    }
  }
        }
