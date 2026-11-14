import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { ArmazenamentoSeguro, criarCredenciais } from './regrasCredenciais';

export { ChaveApiAusenteError } from './regrasCredenciais';

// SecureStore: guarda segredos com a criptografia do próprio sistema
// (Keychain no iOS, Keystore no Android). A chave da RAWG vem do .env e, na
// primeira execução, é copiada para cá; o rawgService sempre lê daqui.

const secureStore: ArmazenamentoSeguro = {
  ler: (chave) => SecureStore.getItemAsync(chave),
  salvar: (chave, valor) => SecureStore.setItemAsync(chave, valor),
  apagar: (chave) => SecureStore.deleteItemAsync(chave),
};

// O Expo só substitui variáveis EXPO_PUBLIC_ escritas assim, por extenso.
function chaveDoEnv(): string {
  return process.env.EXPO_PUBLIC_RAWG_KEY ?? '';
}

// O SecureStore não existe no navegador; lá a chave vem direto do .env.
const credenciais = criarCredenciais(Platform.OS === 'web' ? null : secureStore, chaveDoEnv);

export const obterChaveApi = credenciais.obterChaveApi;
export const apagarChaveApi = credenciais.apagarChaveApi;
