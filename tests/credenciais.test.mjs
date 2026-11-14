import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CHAVE_API,
  ChaveApiAusenteError,
  criarCredenciais,
} from '../src/data/secure/regrasCredenciais.ts';

// Armazenamento falso, no lugar do SecureStore.
function armazenamentoFalso(inicial = {}) {
  const dados = new Map(Object.entries(inicial));
  return {
    dados,
    ler: async (chave) => dados.get(chave) ?? null,
    salvar: async (chave, valor) => {
      dados.set(chave, valor);
    },
    apagar: async (chave) => {
      dados.delete(chave);
    },
  };
}

test('Salva: na primeira execução copia a chave do .env para o armazenamento', async () => {
  const armazenamento = armazenamentoFalso();
  const { obterChaveApi } = criarCredenciais(armazenamento, () => 'chave-do-env');

  assert.equal(await obterChaveApi(), 'chave-do-env');
  assert.equal(armazenamento.dados.get(CHAVE_API), 'chave-do-env');
});

test('Consulta: com o .env vazio, usa a chave já salva', async () => {
  const armazenamento = armazenamentoFalso({ [CHAVE_API]: 'chave-salva' });
  const { obterChaveApi } = criarCredenciais(armazenamento, () => '');

  assert.equal(await obterChaveApi(), 'chave-salva');
});

test('Consulta: se a chave do .env mudar, atualiza a salva', async () => {
  const armazenamento = armazenamentoFalso({ [CHAVE_API]: 'chave-antiga' });
  const { obterChaveApi } = criarCredenciais(armazenamento, () => 'chave-nova');

  assert.equal(await obterChaveApi(), 'chave-nova');
  assert.equal(armazenamento.dados.get(CHAVE_API), 'chave-nova');
});

test('Erro claro quando não há chave no .env nem no armazenamento', async () => {
  const { obterChaveApi } = criarCredenciais(armazenamentoFalso(), () => '   ');

  await assert.rejects(obterChaveApi(), ChaveApiAusenteError);
  await assert.rejects(obterChaveApi(), /EXPO_PUBLIC_RAWG_KEY/);
});

test('Apaga: remove a chave do armazenamento', async () => {
  const armazenamento = armazenamentoFalso({ [CHAVE_API]: 'chave-salva' });
  const { obterChaveApi, apagarChaveApi } = criarCredenciais(armazenamento, () => '');

  await apagarChaveApi();

  assert.equal(armazenamento.dados.has(CHAVE_API), false);
  await assert.rejects(obterChaveApi(), ChaveApiAusenteError);
});

test('Apaga: se a chave continuar no .env, ela é copiada de novo (comportamento esperado)', async () => {
  const armazenamento = armazenamentoFalso({ [CHAVE_API]: 'chave-do-env' });
  const { obterChaveApi, apagarChaveApi } = criarCredenciais(armazenamento, () => 'chave-do-env');

  await apagarChaveApi();
  assert.equal(armazenamento.dados.has(CHAVE_API), false);

  assert.equal(await obterChaveApi(), 'chave-do-env');
  assert.equal(armazenamento.dados.get(CHAVE_API), 'chave-do-env');
});

test('Navegador (sem armazenamento seguro): usa só o .env', async () => {
  const { obterChaveApi, apagarChaveApi } = criarCredenciais(null, () => 'chave-do-env');

  assert.equal(await obterChaveApi(), 'chave-do-env');
  await apagarChaveApi(); // não faz nada e não quebra
  assert.equal(await obterChaveApi(), 'chave-do-env');
});
