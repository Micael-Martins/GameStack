import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buscarJogosRawg,
  converterRawgParaJogo,
} from '../src/services/rawgService.ts';

test('Converte os dados da RAWG para o modelo Jogo', () => {
  const jogo = converterRawgParaJogo({
    id: 3328,
    name: 'The Witcher 3',
    background_image: null,
    released: '2015-05-19',
    playtime: 45,
    genres: [{ name: 'RPG' }],
    platforms: [
      { platform: { name: 'PC' } },
    ],
  });

  assert.equal(jogo.id, 'rawg-3328');
  assert.equal(jogo.nome, 'The Witcher 3');
  assert.equal(jogo.anoLancamento, 2015);
  assert.equal(jogo.tempoMedio, 45);
  assert.deepEqual(jogo.plataformas, ['PC']);
});

test('Pesquisa vazia não chama a API', async () => {
  const resultado = await buscarJogosRawg('   ');

  assert.deepEqual(resultado.jogos, []);
  assert.equal(resultado.total, 0);
});

test('Busca jogos, codifica pesquisa e informa paginação', async () => {
  let urlRecebida = '';

  const fetcher = async (url) => {
    urlRecebida = String(url);

    return new Response(
      JSON.stringify({
        count: 2,
        next: 'proxima-pagina',
        results: [
          {
            id: 3498,
            name: 'Grand Theft Auto V',
            background_image: null,
            released: '2013-09-17',
            playtime: 60,
            genres: [{ name: 'Action' }],
            platforms: [
              { platform: { name: 'PC' } },
            ],
          },
        ],
      }),
      { status: 200 },
    );
  };

  const resultado = await buscarJogosRawg('GTA V', {
    chave: 'chave-de-teste',
    pagina: 2,
    limite: 5,
    fetcher,
  });

  const url = new URL(urlRecebida);

  assert.equal(url.searchParams.get('search'), 'GTA V');
  assert.equal(url.searchParams.get('page'), '2');
  assert.equal(url.searchParams.get('page_size'), '5');
  assert.equal(resultado.jogos[0].nome, 'Grand Theft Auto V');
  assert.equal(resultado.total, 2);
  assert.equal(resultado.temProximaPagina, true);
});

test('Trata erros de autenticação', async () => {
  const fetcher = async () =>
    new Response('{}', { status: 401 });

  await assert.rejects(
    buscarJogosRawg('Zelda', {
      chave: 'chave-de-teste',
      fetcher,
    }),
    /chave inválida/,
  );
});

test('Trata resultados sem jogos', async () => {
  const fetcher = async () =>
    new Response(
      JSON.stringify({
        count: 0,
        next: null,
        results: [],
      }),
      { status: 200 },
    );

  const resultado = await buscarJogosRawg(
    'jogo inexistente',
    {
      chave: 'chave-de-teste',
      fetcher,
    },
  );

  assert.equal(resultado.total, 0);
  assert.deepEqual(resultado.jogos, []);
  assert.equal(resultado.temProximaPagina, false);
});
