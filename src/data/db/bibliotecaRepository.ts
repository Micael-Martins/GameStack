import * as Crypto from 'expo-crypto';

import { criarBibliotecaRepository } from './bibliotecaRepositoryBase';
import { obterBanco } from './database';

export { JogoJaNaBibliotecaError, linhaParaModel } from './bibliotecaRepositoryBase';
export type { MudancaStatus } from './bibliotecaRepositoryBase';

// Repositório da biblioteca: o único lugar que escreve SQL da biblioteca.
// Converte as linhas das tabelas para os models, então nenhuma tela precisa de SQL.
const repositorio = criarBibliotecaRepository({
  obterBanco,
  gerarId: () => Crypto.randomUUID(),
});

export const {
  salvarJogo,
  adicionarNaBiblioteca,
  estaNaBiblioteca,
  listarApiIdsSalvos,
  listarBiblioteca,
  buscarPorId,
  atualizarAnotacao,
  atualizarMinutos,
  mudarStatus,
  removerJogo,
} = repositorio;
