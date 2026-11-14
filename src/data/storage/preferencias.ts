import AsyncStorage from '@react-native-async-storage/async-storage';

export const CHAVES = {
  onboardingVisto: 'onboardingVisto',
  pesquisasRecentes: 'pesquisasRecentes',
  ultimoFiltro: 'ultimoFiltro',
} as const;

export type Preferencias = {
  [CHAVES.onboardingVisto]: boolean;
  [CHAVES.pesquisasRecentes]: string[];
  [CHAVES.ultimoFiltro]: string;
};

type ChavePreferencia = keyof Preferencias;

const VALORES_PADRAO: Preferencias = {
  [CHAVES.onboardingVisto]: false,
  [CHAVES.pesquisasRecentes]: [],
  [CHAVES.ultimoFiltro]: '',
};

export async function salvar<K extends ChavePreferencia>(
  chave: K,
  valor: Preferencias[K],
): Promise<void> {
  try {
    await AsyncStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // Erros de armazenamento não devem interromper a navegação do app.
  }
}

export async function ler<K extends ChavePreferencia>(
  chave: K,
): Promise<Preferencias[K]> {
  try {
    const valorSalvo = await AsyncStorage.getItem(chave);

    if (valorSalvo === null) {
      return VALORES_PADRAO[chave];
    }

    const valorInterpretado: unknown = JSON.parse(valorSalvo);
    if (!valorValido(chave, valorInterpretado)) {
      return VALORES_PADRAO[chave];
    }

    return valorInterpretado;
  } catch {
    return VALORES_PADRAO[chave];
  }
}

function valorValido<K extends ChavePreferencia>(
  chave: K,
  valor: unknown,
): valor is Preferencias[K] {
  if (chave === CHAVES.onboardingVisto) return typeof valor === 'boolean';
  if (chave === CHAVES.pesquisasRecentes) {
    return Array.isArray(valor) && valor.every((item) => typeof item === 'string');
  }
  return typeof valor === 'string';
}

export async function adicionarPesquisaRecente(pesquisa: string): Promise<void> {
  const termo = pesquisa.trim();
  if (!termo) return;

  const pesquisasAtuais = await ler(CHAVES.pesquisasRecentes);
  const pesquisasAtualizadas = [
    termo,
    ...pesquisasAtuais.filter((item) => item.toLocaleLowerCase() !== termo.toLocaleLowerCase()),
  ].slice(0, 5);

  await salvar(CHAVES.pesquisasRecentes, pesquisasAtualizadas);
}

export async function limparPesquisasRecentes(): Promise<void> {
  await salvar(CHAVES.pesquisasRecentes, []);
}

export async function limparTudo(): Promise<void> {
  try {
    await AsyncStorage.multiRemove(Object.values(CHAVES));
  } catch {
    // Mantém o mesmo comportamento tolerante a falhas das demais operações.
  }
}
