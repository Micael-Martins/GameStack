import { Platform } from 'react-native';

export const initDatabase = async () => {
    if (Platform.OS === 'web') {
        console.warn('SQLite nativo só roda em Android/iOS.');
        return null;
    }
}

export const obterBanco = async (): Promise<never> => {
    throw new Error('O banco SQLite só funciona no Android e no iOS.');
};

export const apagarDadosDoBanco = async (): Promise<never> => {
    throw new Error('O banco SQLite só funciona no Android e no iOS.');
};
