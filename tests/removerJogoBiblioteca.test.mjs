import assert from 'node:assert/strict';
import test from 'node:test';

import { textoConfirmacaoRemocao } from '../src/features/biblioteca/Model/remocaoJogo.ts';

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
