import assert from "node:assert/strict";
import test from "node:test";

import { prepararDadosCardJogo } from "../src/utils/cardJogoUtils.ts";

const AGORA = new Date(2026, 10, 15, 10, 0); // 15 nov 2026

function criarItem({
  status = "JOGANDO",
  minutosJogados = 0,
  tempoMedio = 50,
  genero = "RPG, Action",
  plataformas = ["PC", "PlayStation 5"],
  ultimaInteracao = new Date(2026, 10, 14, 20, 0).toISOString(), // ontem
} = {}) {
  return {
    id: "biblioteca-1",
    jogo: {
      id: "rawg-1",
      apiId: "1",
      origemAPI: "RAWG",
      nome: "Jogo de teste",
      imagemURL: null,
      genero,
      desenvolvedora: "",
      anoLancamento: 2020,
      tempoMedio,
      plataformas,
    },
    status,
    minutosJogados,
    nota: null,
    anotacao: "",
    dataAdicao: "2026-11-01T10:00:00.000Z",
    dataConclusao: null,
    ultimaInteracao,
  };
}

test('linha "plataforma · gênero" usa só o primeiro de cada', () => {
  assert.equal(
    prepararDadosCardJogo(criarItem(), AGORA).plataformaGenero,
    "PC · RPG",
  );
  assert.equal(
    prepararDadosCardJogo(criarItem({ plataformas: [] }), AGORA)
      .plataformaGenero,
    "RPG",
  );
});

test('Jogando com tempo médio: "12h de ~50h" e barra', () => {
  const dados = prepararDadosCardJogo(
    criarItem({ minutosJogados: 12 * 60 + 40 }),
    AGORA,
  );
  assert.equal(dados.textoHoras, "12h de ~50h");
  assert.equal(dados.mostrarBarra, true);
  assert.ok(Math.abs(dados.progresso - 760 / 3000) < 1e-9);
});

test("Jogando sem tempo médio: só as horas e sem barra", () => {
  const dados = prepararDadosCardJogo(
    criarItem({ minutosJogados: 600, tempoMedio: 0 }),
    AGORA,
  );
  assert.equal(dados.textoHoras, "10h");
  assert.equal(dados.mostrarBarra, false);
});

test('Na fila: "ainda não começou" e sem barra', () => {
  const dados = prepararDadosCardJogo(criarItem({ status: "NA_FILA" }), AGORA);
  assert.equal(dados.textoHoras, "ainda não começou");
  assert.equal(dados.mostrarBarra, false);
});

test("Concluído e Abandonado: horas jogadas e sem barra", () => {
  const concluido = prepararDadosCardJogo(
    criarItem({ status: "CONCLUIDO", minutosJogados: 540 }),
    AGORA,
  );
  assert.equal(concluido.textoHoras, "9h");
  assert.equal(concluido.mostrarBarra, false);

  const abandonado = prepararDadosCardJogo(
    criarItem({ status: "ABANDONADO", minutosJogados: 150 }),
    AGORA,
  );
  assert.equal(abandonado.textoHoras, "2h 30min");
});

test('linha compacta: "PC · 18h de ~27h · ontem"', () => {
  const dados = prepararDadosCardJogo(
    criarItem({ minutosJogados: 18 * 60, tempoMedio: 27 }),
    AGORA,
  );
  assert.equal(dados.linhaCompacta, "PC · 18h de ~27h · ontem");
});

test("progresso nunca passa de 100%", () => {
  const dados = prepararDadosCardJogo(
    criarItem({ minutosJogados: 100 * 60, tempoMedio: 50 }),
    AGORA,
  );
  assert.equal(dados.progresso, 1);
});
