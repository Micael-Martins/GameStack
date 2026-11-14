import { Platform } from 'react-native';

export const initDatabase = async () => {
    if (Platform.OS === 'web') {
        console.warn('SQLite nativo só roda em Android/iOS.');
        return null;
    }
}

// No navegador não existe SQLite nativo: os repositórios avisam com um erro claro.
export const obterBanco = async (): Promise<never> => {
    throw new Error('O banco SQLite só funciona no Android e no iOS.');
};
