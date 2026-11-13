import { Platform } from 'react-native';

export const initDatabase = async () => {
    if (Platform.OS === 'web') {
        console.warn('SQLite nativo só roda em Android/iOS.');
        return null;
    }
}
