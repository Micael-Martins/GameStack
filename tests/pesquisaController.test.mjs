import assert from 'node:assert/strict';
import test from 'node:test';

import {
  criarPesquisaController,
} from '../src/features/pesquisar/ViewModel/pesquisaController.ts';

function jogo(id) {
  return {
    id: `rawg-${id}`,
    apiId: String(id),
    origemAPI: 'RAWG',
    nome: `Jogo ${id}`,
    imagemURL: null,
    genero: 'Aventura',
    desenvolvedora: '',
    anoLancamento: 2020,
    tempoMedio: 5,
    plataformas: [],
  };
}

function resposta(ids, pagina = 1, temProximaPagina = false) {
  return {
    jogos: ids.map(jogo),
    total: 10,
    pagina,
    temProximaPagina,
  };
}

test('Pesquisa vazia não chama a API', async () => {
  let chamadas = 0;

  const controller = criarPesquisaController(async () => {
    chamadas++;
    return resposta([]);
  });

  const sucesso = await controller.pesquisar('   ');

  assert.equal(sucesso, false);
  assert.equal(chamadas, 0);
  assert.equal(controller.obterEstado().pesquisou, false);
});

test('Pesquisa retorna jogos e atualiza o estado', async () => {
  let termoRecebido = '';
  let paginaRecebida = 0;

  const controller = criarPesquisaController(async (termo, opcoes) => {
    termoRecebido = termo;
    paginaRecebida = opcoes.pagina;

    return resposta([1, 2], 1, true);
  });

  const sucesso = await controller.pesquisar('  Zelda  ');
  const estado = controller.obterEstado();

  assert.equal(sucesso, true);
  assert.equal(termoRecebido, 'Zelda');
  assert.equal(paginaRecebida, 1);
  assert.equal(estado.jogos.length, 2);
  assert.equal(estado.temProximaPagina, true);
  assert.equal(estado.carregando, false);
  assert.equal(estado.pesquisou, true);
  assert.equal(estado.erro, null);
});

test('Pesquisa sem resultados mantém o estado vazio', async () => {
  const controller = criarPesquisaController(async () => resposta([]));

  await controller.pesquisar('Jogo inexistente');

  const estado = controller.obterEstado();

  assert.deepEqual(estado.jogos, []);
  assert.equal(estado.pesquisou, true);
  assert.equal(estado.erro, null);
});

test('Erro da API aparece no estado da pesquisa', async () => {
  const controller = criarPesquisaController(async () => {
    throw new Error('RAWG: falha de conexão.');
  });

  const sucesso = await controller.pesquisar('Zelda');
  const estado = controller.obterEstado();

  assert.equal(sucesso, false);
  assert.equal(estado.carregando, false);
  assert.equal(estado.pesquisou, true);
  assert.match(estado.erro, /falha de conexão/);
});

test('Paginação adiciona novos jogos sem duplicar', async () => {
  const paginasConsultadas = [];

  const controller = criarPesquisaController(async (_termo, opcoes) => {
    paginasConsultadas.push(opcoes.pagina);

    if (opcoes.pagina === 1) {
      return resposta([1, 2], 1, true);
    }

    return resposta([2, 3], 2, false);
  });

  await controller.pesquisar('Zelda');
  const sucesso = await controller.carregarMais();

  const estado = controller.obterEstado();

  assert.equal(sucesso, true);
  assert.deepEqual(paginasConsultadas, [1, 2]);
  assert.deepEqual(
    estado.jogos.map((item) => item.id),
    ['rawg-1', 'rawg-2', 'rawg-3'],
  );
  assert.equal(estado.pagina, 2);
  assert.equal(estado.temProximaPagina, false);
});

test('Não consulta outra página quando a busca terminou', async () => {
  let chamadas = 0;

  const controller = criarPesquisaController(async () => {
    chamadas++;
    return resposta([1], 1, false);
  });

  await controller.pesquisar('Zelda');
  const sucesso = await controller.carregarMais();

  assert.equal(sucesso, false);
  assert.equal(chamadas, 1);
});

test('Resposta antiga não substitui uma pesquisa mais recente', async () => {
  let finalizarBuscaAntiga;
  let sinalAntigo;

  const controller = criarPesquisaController(async (termo, opcoes) => {
    if (termo === 'Antigo') {
      sinalAntigo = opcoes.signal;

      return new Promise((resolve) => {
        finalizarBuscaAntiga = resolve;
      });
    }

    return resposta([22]);
  });

  const buscaAntiga = controller.pesquisar('Antigo');

  await controller.pesquisar('Novo');

  assert.equal(sinalAntigo.aborted, true);

  // Simula uma API que respondeu mesmo depois do cancelamento.
  finalizarBuscaAntiga(resposta([11]));
  await buscaAntiga;

  const estado = controller.obterEstado();

  assert.equal(estado.termoPesquisado, 'Novo');
  assert.equal(estado.jogos[0].id, 'rawg-22');
});

test('Falha ao carregar mais preserva os resultados existentes', async () => {
  let falhar = true;

  const controller = criarPesquisaController(async (_termo, opcoes) => {
    if (opcoes.pagina === 1) {
      return resposta([1], 1, true);
    }

    if (falhar) {
      throw new Error('RAWG: erro na segunda página.');
    }

    return resposta([2], 2, false);
  });

  await controller.pesquisar('Zelda');

  assert.equal(await controller.carregarMais(), false);
  assert.equal(controller.obterEstado().jogos.length, 1);
  assert.match(controller.obterEstado().erro, /segunda página/);

  // Deve ser possível tentar novamente.
  falhar = false;

  assert.equal(await controller.carregarMais(), true);
  assert.equal(controller.obterEstado().jogos.length, 2);
  assert.equal(controller.obterEstado().erro, null);
});

test('Limpar pesquisa restaura o estado inicial', async () => {
  const controller = criarPesquisaController(async () => resposta([1]));

  await controller.pesquisar('Zelda');

  controller.limpar();

  const estado = controller.obterEstado();

  assert.equal(estado.termoPesquisado, '');
  assert.deepEqual(estado.jogos, []);
  assert.equal(estado.pesquisou, false);
  assert.equal(estado.carregando, false);
});

// ---------- Ajustes: mínimo de letras, tentar novamente e mensagens ----------

test('Com menos de 2 letras não chama a API e mostra aviso', async () => {
  let chamadas = 0;
  const controller = criarPesquisaController(async () => {
    chamadas++;
    return resposta([1]);
  });

  const sucesso = await controller.pesquisar(' z ');
  const estado = controller.obterEstado();

  assert.equal(sucesso, false);
  assert.equal(chamadas, 0);
  assert.equal(estado.aviso, 'Digite pelo menos 2 letras.');
  assert.equal(estado.pesquisou, false);
});

test('Com 2 letras a pesquisa acontece e o aviso some', async () => {
  const controller = criarPesquisaController(async () => resposta([1]));

  await controller.pesquisar('z');
  assert.ok(controller.obterEstado().aviso);

  assert.equal(await controller.pesquisar('ze'), true);
  assert.equal(controller.obterEstado().aviso, null);
});

test('Mensagem de erro chega sem o prefixo "RAWG:"', async () => {
  const controller = criarPesquisaController(async () => {
    throw new Error('RAWG: falha de conexão. Verifique a internet.');
  });

  await controller.pesquisar('Zelda');

  assert.equal(controller.obterEstado().erro, 'falha de conexão. Verifique a internet.');
});

test('tentarNovamente repete a pesquisa que falhou', async () => {
  let falhar = true;
  const controller = criarPesquisaController(async () => {
    if (falhar) throw new Error('RAWG: falha de conexão.');
    return resposta([1, 2]);
  });

  await controller.pesquisar('Zelda');
  assert.ok(controller.obterEstado().erro);

  falhar = false;
  assert.equal(await controller.tentarNovamente(), true);
  assert.equal(controller.obterEstado().jogos.length, 2);
  assert.equal(controller.obterEstado().erro, null);
});

test('tentarNovamente sem pesquisa anterior não faz nada', async () => {
  let chamadas = 0;
  const controller = criarPesquisaController(async () => {
    chamadas++;
    return resposta([1]);
  });

  assert.equal(await controller.tentarNovamente(), false);
  assert.equal(chamadas, 0);
});
test('Tentar novamente recupera a paginação sem perder resultados', async () => {
  let falhar = true;

  const controller = criarPesquisaController(async (_termo, opcoes) => {
    if (opcoes.pagina === 1) {
      return resposta([1], 1, true);
    }

    if (falhar) {
      throw new Error('RAWG: falha de conexão.');
    }

    return resposta([2], 2, false);
  });

  await controller.pesquisar('Zelda');

  assert.equal(await controller.carregarMais(), false);
  assert.equal(controller.obterEstado().jogos.length, 1);

  falhar = false;

  assert.equal(await controller.tentarNovamente(), true);
  assert.equal(controller.obterEstado().jogos.length, 2);
  assert.equal(controller.obterEstado().erro, null);
  assert.equal(controller.obterEstado().pagina, 2);
});
