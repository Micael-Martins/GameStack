import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// SecureStore: guarda segredos com a criptografia do próprio sistema
// (Keychain no iOS, Keystore no Android). A chave da RAWG vem do .env e, na
// primeira execução, é copiada para cá; o rawgService sempre lê daqui.

const CHAVE_API = 'rawgApiKey';

// Erro com mensagem clara para quando o .env não tem a chave.
export class ChaveApiAusenteError extends Error {
  constructor() {
    super(
      'Chave da RAWG não configurada. Crie o arquivo .env com EXPO_PUBLIC_RAWG_KEY e reinicie o Expo.',
    );
    this.name = 'ChaveApiAusenteError';
  }
}

// O Expo só substitui variáveis EXPO_PUBLIC_ escritas assim, por extenso.
function chaveDoEnv(): string {
  return (process.env.EXPO_PUBLIC_RAWG_KEY ?? '').trim();
}

// O SecureStore não existe no navegador; lá a chave vem direto do .env.
const secureStoreDisponivel = Platform.OS !== 'web';

// Lê a chave do SecureStore. Se ainda não existir (primeira execução) ou se a
// chave do .env tiver sido trocada, copia a do .env e salva.
export async function obterChaveApi(): Promise<string> {
  const doEnv = chaveDoEnv();

  if (!secureStoreDisponivel) {
    if (!doEnv) throw new ChaveApiAusenteError();
    return doEnv;
  }

  const salva = await SecureStore.getItemAsync(CHAVE_API);

  if (doEnv && doEnv !== salva) {
    await SecureStore.setItemAsync(CHAVE_API, doEnv);
    return doEnv;
  }
  if (salva) return salva;

  throw new ChaveApiAusenteError();
}

// Usado no "Apagar todos os dados".
export async function apagarChaveApi(): Promise<void> {
  if (!secureStoreDisponivel) return;
  await SecureStore.deleteItemAsync(CHAVE_API);
}
