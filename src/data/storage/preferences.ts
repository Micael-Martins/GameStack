/*
    Responsável por armazenar e recuperar pequenas informações do aplicativo no dispositivo do usuário.
*/

import AsyncStorage from '@react-native-async-storage/async-storage';

// reúne todas as chaves utilizadas para salvar e recuperar informações do AsyncStorage.
export const KEYS = {
  onboardingSeen: 'onboardingSeen',
  recentSearches: 'recentSearches',
  lastFilter: 'lastFilter',
} as const;

// garante que as funções de armazenamento só aceitem chaves que realmente existem no objeto KEYS.
type Key = (typeof KEYS)[keyof typeof KEYS];

// responsável por salvar informações no AsyncStorage.
export async function save<T>(key: Key, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Erro ao salvar "${key}":`, error);
  }
}

// recupera informações armazenadas.
export async function read<T>(key: Key): Promise<T | null> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(`Erro ao ler "${key}":`, error);
    return null;
  }
}

// verifica se o usuário já visualizou a apresentação inicial do GameStack.
export async function hasSeenOnboarding(): Promise<boolean> {
  return (await read<boolean>(KEYS.onboardingSeen)) ?? false;
}

// registra que o usuário já visualizou a apresentação inicial.
export async function markOnboardingSeen(): Promise<void> {
  await save(KEYS.onboardingSeen, true);
}