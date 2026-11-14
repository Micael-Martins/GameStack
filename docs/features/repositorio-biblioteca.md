# Repositório da biblioteca

`src/data/db/bibliotecaRepository.ts` é o único lugar que escreve SQL da biblioteca. Ele converte as linhas das tabelas `jogo_biblioteca` e `jogo` (via JOIN) no model `JogoBiblioteca`, então nenhuma tela precisa escrever SQL.

As regras ficam em `bibliotecaRepositoryBase.ts`, sem depender do Expo, para poderem ser testadas no Node com um SQLite em memória e o mesmo esquema do app (`esquema.ts`).

## Cartão: adicionar jogo na biblioteca

- `salvarJogo(jogo)`: `INSERT OR IGNORE` na tabela `jogo` e devolve o id local. Plataformas são guardadas como JSON; se a desenvolvedora vier depois, ela é aproveitada.
- `adicionarNaBiblioteca(jogo, status, minutos)`: cria a linha com `dataAdicao` e `ultimaInteracao` = agora; `CONCLUIDO` já preenche `dataConclusao`; `NA_FILA` sempre começa com 0 minutos. Adicionar o mesmo jogo de novo lança `JogoJaNaBibliotecaError`.
- `estaNaBiblioteca(apiId)` e `listarApiIdsSalvos()`: para a tela de Resultados.
- Ids gerados com `expo-crypto` (`randomUUID`).

## Cartão: listar, buscar, atualizar e remover

- `linhaParaModel()`: plataformas de JSON para `string[]`, nota e datas nulas tratadas.
- `listarBiblioteca()`: ordenado por `ultimaInteracao` (mais recente primeiro).
- `buscarPorId(id)`: devolve o `JogoBiblioteca` ou `null`.
- `atualizarAnotacao(id, texto)` e `atualizarMinutos(id, minutos)`: sempre atualizam `ultimaInteracao`.
- `mudarStatus(id, { status, nota, dataConclusao })`: só grava; as regras ficam no cartão "Regras de mudança de status".
- `removerJogo(id)`: apaga de `jogo_biblioteca`; o jogo continua na tabela `jogo` como cache.
- Todas as consultas usam parâmetros (`?`).

O `database.ts` ganhou `obterBanco()`, que abre o banco uma vez e reaproveita a conexão.

## Testes

```bash
node --test "tests/**/*.test.mjs"
```
