import assert from 'node:assert/strict';
import test from 'node:test';

import {
  linhaDesenvolvedora,
  linhaPlataformasGenero,
  linhaResultado,
  textoLancamento,
  textoTempoMedio,
} from '../src/components/utils/cardResultadoUtils.ts';
import { buscarDetalhes, converterRawgParaJogo, extrairSobre } from '../src/data/services/rawgService.ts';
import {
  horasParaMinutos,
  minutosIniciais,
  mostraCampoHoras,
  OPCOES_STATUS_INICIAL,
  STATUS_INICIAL_PADRAO,
} from '../src/features/pesquisar/Model/adicionarJogo.ts';

const zelda = {
  id: 'rawg-1',
  apiId: '1',
  origemAPI: 'RAWG',
  nome: 'The Legend of Zelda: Breath of the Wild',
  imagemURL: null,
  genero: 'Aventura, Ação',
  desenvolvedora: 'Nintendo EPD, Nintendo',
  anoLancamento: 2017,
  tempoMedio: 50,
  plataformas: ['Switch', 'Wii U', 'PC'],
};

// ---------- CardResultado ----------

test('CardResultado: "ano · plataformas · gênero" com no máximo 2 plataformas', () => {
  assert.equal(linhaResultado(zelda), '2017 · Switch, Wii U · Aventura');
});

test('CardResultado: pula o que estiver vazio', () => {
  assert.equal(linhaResultado({ ...zelda, anoLancamento: null, plataformas: [], genero: '' }), '');
  assert.equal(linhaResultado({ ...zelda, anoLancamento: null }), 'Switch, Wii U · Aventura');
});

test('CardResultado: "~Xh em média" some quando o tempo médio é 0', () => {
  assert.equal(textoTempoMedio(50), '~50h em média');
  assert.equal(textoTempoMedio(0), '');
});

test('Adicionar: "desenvolvedora · ano" e "plataformas · gênero"', () => {
  assert.equal(linhaDesenvolvedora(zelda), 'Nintendo EPD · 2017');
  assert.equal(linhaDesenvolvedora({ ...zelda, desenvolvedora: '' }), '2017');
  assert.equal(linhaPlataformasGenero(zelda), 'Switch, Wii U · Aventura');
});

// ---------- Adicionar jogo ----------

test('Adicionar: 4 status na ordem do protótipo, com Jogando já selecionado', () => {
  assert.deepEqual(
    OPCOES_STATUS_INICIAL.map((o) => o.status),
    ['NA_FILA', 'JOGANDO', 'CONCLUIDO', 'ABANDONADO'],
  );
  assert.equal(STATUS_INICIAL_PADRAO, 'JOGANDO');
});

test('Adicionar: o campo de horas some só em Na fila', () => {
  assert.equal(mostraCampoHoras('NA_FILA'), false);
  for (const status of ['JOGANDO', 'CONCLUIDO', 'ABANDONADO']) assert.equal(mostraCampoHoras(status), true);
});

test('Adicionar: horas viram minutos (aceita vírgula e ponto; vazio é 0)', () => {
  assert.equal(horasParaMinutos('12'), 720);
  assert.equal(horasParaMinutos('12,5'), 750);
  assert.equal(horasParaMinutos('0.25'), 15);
  assert.equal(horasParaMinutos(''), 0);
  assert.equal(horasParaMinutos('  '), 0);
  for (const ruim of ['abc', '-3', '1,2,3', '12h']) assert.equal(horasParaMinutos(ruim), null, ruim);
});

test('Adicionar: Na fila salva 0 minutos mesmo com horas digitadas', () => {
  assert.equal(minutosIniciais('NA_FILA', '40'), 0);
  assert.equal(minutosIniciais('JOGANDO', '40'), 2400);
  assert.equal(minutosIniciais('CONCLUIDO', 'xx'), null);
});

// ---------- buscarDetalhes ----------

test('buscarDetalhes chama /games/{id} e traz a desenvolvedora', async () => {
  let urlChamada = '';
  const fetcher = async (url) => {
    urlChamada = url;
    return new Response(
      JSON.stringify({
        id: 22511,
        name: 'Zelda',
        background_image: null,
        released: '2017-03-03',
        playtime: 50,
        genres: [{ name: 'Adventure' }],
        platforms: [{ platform: { name: 'Nintendo Switch' } }],
        developers: [{ name: 'Nintendo EPD' }, { name: 'Nintendo' }],
      }),
      { status: 200 },
    );
  };

  const jogo = await buscarDetalhes('22511', { chave: 'abc', fetcher });

  assert.match(urlChamada, /\/games\/22511\?key=abc$/);
  assert.equal(jogo.desenvolvedora, 'Nintendo EPD, Nintendo');
  assert.equal(jogo.anoLancamento, 2017);
});

test('buscarDetalhes lança erro quando a RAWG falha (a tela segue sem a desenvolvedora)', async () => {
  const fetcher = async () => new Response('{}', { status: 500 });
  await assert.rejects(() => buscarDetalhes('1', { chave: 'abc', fetcher }), /HTTP 500/);
});

test('A pesquisa continua sem desenvolvedora (ela só vem no detalhe)', () => {
  const jogo = converterRawgParaJogo({ id: 1, name: 'X', background_image: null, released: null, playtime: 0, genres: [], platforms: null });
  assert.equal(jogo.desenvolvedora, '');
});

// ---------- Sobre o jogo (tela Adicionar) ----------

test('buscarDetalhes traz o "Sobre o jogo": descrição, Metacritic e lançamento', async () => {
  const fetcher = async () =>
    new Response(
      JSON.stringify({
        id: 22511,
        name: 'Zelda',
        background_image: null,
        released: '2017-03-03',
        playtime: 50,
        genres: [],
        platforms: null,
        description_raw: 'Explore um reino enorme.\n\nEspañol\nExplora un reino enorme.',
        metacritic: 97,
      }),
      { status: 200 },
    );

  const detalhes = await buscarDetalhes('22511', { chave: 'abc', fetcher });

  assert.deepEqual(detalhes.sobre, {
    descricao: 'Explore um reino enorme.', // sem a parte repetida em espanhol
    metacritic: 97,
    dataLancamento: '2017-03-03',
  });
});

test('extrairSobre: sem descrição ou Metacritic, volta vazio/nulo', () => {
  assert.deepEqual(extrairSobre({ released: null }), { descricao: '', metacritic: null, dataLancamento: null });
  assert.equal(extrairSobre({ metacritic: 0 }).metacritic, null);
});

test('textoLancamento: "Lançado em 03 mar 2017" sem mudar o dia por causa do fuso', () => {
  assert.equal(textoLancamento('2017-03-03'), 'Lançado em 03 mar 2017');
  assert.equal(textoLancamento('2023-12-31'), 'Lançado em 31 dez 2023');
  assert.equal(textoLancamento(null), '');
  assert.equal(textoLancamento('2017'), '');
});