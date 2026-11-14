// Regras da chave da RAWG, sem depender do Expo nem do React Native.
// Assim dá para testar com `node --test` usando um armazenamento falso.

export const CHAVE_API = 'rawgApiKey';

// O que o app precisa de um armazenamento seguro (o SecureStore no celular).
export interface ArmazenamentoSeguro {
  ler(chave: string): Promise<string | null>;
  salvar(chave: string, valor: string): Promise<void>;
  apagar(chave: string): Promise<void>;
}

// Erro com mensagem clara para quando não existe chave em lugar nenhum.
export class ChaveApiAusenteError extends Error {
  constructor() {
    super(
      'Chave da RAWG não configurada. Crie o arquivo .env com EXPO_PUBLIC_RAWG_KEY e reinicie o Expo.',
    );
    this.name = 'ChaveApiAusenteError';
  }
}

export interface Credenciais {
  obterChaveApi(): Promise<string>;
  apagarChaveApi(): Promise<void>;
}

// armazenamento = null quando não há armazenamento seguro (navegador):
// nesse caso a chave vem sempre do .env.
export function criarCredenciais(
  armazenamento: ArmazenamentoSeguro | null,
  lerChaveDoEnv: () => string,
): Credenciais {
  // Lê do armazenamento seguro. Na primeira execução (ou se a chave do .env
  // for trocada), copia a chave do .env e salva.
  async function obterChaveApi(): Promise<string> {
    const doEnv = lerChaveDoEnv().trim();

    if (!armazenamento) {
      if (!doEnv) throw new ChaveApiAusenteError();
      return doEnv;
    }

    const salva = await armazenamento.ler(CHAVE_API);

    if (doEnv && doEnv !== salva) {
      await armazenamento.salvar(CHAVE_API, doEnv);
      return doEnv;
    }
    if (salva) return salva;

    throw new ChaveApiAusenteError();
  }

  // Usado no "Apagar todos os dados". Se a chave continuar no .env, ela é
  // copiada de novo na próxima busca: o .env é a fonte da chave, e sem isso a
  // pesquisa pararia de funcionar depois de apagar os dados.
  async function apagarChaveApi(): Promise<void> {
    if (!armazenamento) return;
    await armazenamento.apagar(CHAVE_API);
  }

  return { obterChaveApi, apagarChaveApi };
}
