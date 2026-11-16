import assert from 'node:assert/strict';
import test from 'node:test';

import { semSobrepor } from '../src/utils/semSobrepor.ts';

// Tarefa falsa que demora um pouco e registra o que aconteceu.
function tarefaLenta(registro) {
  let rodando = 0;
  return async () => {
    rodando++;
    registro.push(`inicio (rodando: ${rodando})`);
    await new Promise((resolver) => setTimeout(resolver, 10));
    registro.push('fim');
    rodando--;
  };
}

test('duas chamadas seguidas não rodam ao mesmo tempo', async () => {
  const registro = [];
  const executar = semSobrepor(tarefaLenta(registro));

  await Promise.all([executar(), executar()]);

  assert.deepEqual(registro, ['inicio (rodando: 1)', 'fim', 'inicio (rodando: 1)', 'fim']);
});

test('várias chamadas enquanto roda viram uma única repetição', async () => {
  const registro = [];
  const executar = semSobrepor(tarefaLenta(registro));

  await Promise.all([executar(), executar(), executar(), executar()]);

  assert.equal(registro.filter((r) => r.startsWith('inicio')).length, 2);
});

test('depois de terminar, uma chamada nova roda de novo', async () => {
  const registro = [];
  const executar = semSobrepor(tarefaLenta(registro));

  await executar();
  await executar();

  assert.equal(registro.filter((r) => r.startsWith('inicio')).length, 2);
});

test('se a tarefa falhar, a repetição ainda roda', async () => {
  let vezes = 0;
  const executar = semSobrepor(async () => {
    vezes++;
    await new Promise((resolver) => setTimeout(resolver, 5));
    if (vezes === 1) throw new Error('falhou');
  });

  const primeira = executar();
  const segunda = executar();

  await assert.rejects(primeira, /falhou/);
  await segunda;
  assert.equal(vezes, 2);
});