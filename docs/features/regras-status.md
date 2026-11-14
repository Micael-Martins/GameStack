# Regras de mudança de status

Arquivo: `src/store/regrasStatus.ts`

Todas as telas mudam o status de um jogo pela mesma função, para a regra nunca ficar diferente entre a Biblioteca, os Detalhes e o painel "Mudar status".

```ts
aplicarMudancaStatus(jogoAtual, novoStatus, nota?, agora?) // devolve { status, nota, dataConclusao }
```

A função é pura (não acessa banco): ela só calcula o que deve ser gravado. Quem grava é o `mudarStatus` do repositório, que também atualiza o `ultimaInteracao`.

## Regras

| Novo status | nota | dataConclusao |
| --- | --- | --- |
| Concluído | a nota recebida (1 a 5) ou a que já tinha | agora |
| Abandonado | a nota recebida ou a que já tinha | limpa (não conta como concluído) |
| Jogando | limpa | limpa |
| Na fila | limpa | limpa |

- Nota inválida (fora de 1 a 5 ou não inteira) é ignorada. `notaValida(nota)` também é exportada para as telas.
- Toda mudança atualiza `ultimaInteracao` (feito pelo repositório).

## Testes

`tests/regrasStatus.test.mjs` cobre as 5 transições do cartão (Na fila → Jogando, Jogando → Concluído, Concluído → Jogando, Jogando → Abandonado, Abandonado → Na fila) e os casos de nota inválida e de Concluído → Abandonado mantendo a nota.

```bash
npm test
```
