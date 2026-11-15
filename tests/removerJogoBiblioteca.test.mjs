import assert from 'node:assert/strict';
import test from 'node:test';

import {
  executarRemocaoJogo,
  textoConfirmacaoRemocao,
} from '../src/features/biblioteca/Model/remocaoJogo.ts';

test('Mostra a confirmação exigida pelo Trello', () => {
  const texto = textoConfirmacaoRemocao('Hollow Knight');

  assert.deepEqual(texto, {
    titulo: 'Remover Hollow Knight?',
    mensagem: 'As horas e a nota serão perdidas.',
  });
});

test('Inclui corretamente o nome do jogo na confirmação', () => {
  const texto = textoConfirmacaoRemocao('Stardew Valley');

  assert.equal(texto.titulo, 'Remover Stardew Valley?');
});

test('Remove pela store antes de reagendar o lembrete', async () => {
  const chamadas = [];

  await executarRemocaoJogo('jogo-123', {
    remover: async (id) => {
      chamadas.push(`remover:${id}`);
    },
    reagendarLembrete: async () => {
      chamadas.push('reagendar');
    },
  });

  assert.deepEqual(chamadas, [
    'remover:jogo-123',
    'reagendar',
  ]);
});

test('Espera a remoção terminar antes do reagendamento', async () => {
  const chamadas = [];

  await executarRemocaoJogo('jogo-456', {
    remover: async () => {
      await Promise.resolve();
      chamadas.push('removido');
    },
    reagendarLembrete: async () => {
      chamadas.push('lembrete');
    },
  });

  assert.deepEqual(chamadas, ['removido', 'lembrete']);
});

test('Se a remoção falhar, não reagenda o lembrete', async () => {
  let reagendou = false;

  await assert.rejects(
    executarRemocaoJogo('jogo-789', {
      remover: async () => {
        throw new Error('Falha ao remover');
      },
      reagendarLembrete: async () => {
        reagendou = true;
      },
    }),
    /Falha ao remover/,
  );

  assert.equal(reagendou, false);
});

test('Falha no lembrete não invalida a remoção realizada', async () => {
  let removido = false;

  const avisoOriginal = console.warn;
  console.warn = () => {};

  try {
    await executarRemocaoJogo('jogo-999', {
      remover: async () => {
        removido = true;
      },
      reagendarLembrete: async () => {
        throw new Error('Notificações indisponíveis');
      },
    });
  } finally {
    console.warn = avisoOriginal;
  }

  assert.equal(removido, true);
});
