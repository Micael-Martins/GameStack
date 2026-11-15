# Tela Concluir jogo

Tela 10 do protótipo. Abre pelo painel "Mudar status" → "Concluir jogo" (na tela Detalhes), como um modal de tela cheia que sobe de baixo. Fecha no X sem salvar nada.

Arquivos (MVVM):

- `features/biblioteca/Views/ConcluirJogoScreen.tsx`
- `features/biblioteca/ViewModel/useConcluirViewModel.ts`: nota escolhida, anotação final, próximo da fila e salvando.
- `features/biblioteca/Model/conclusao.ts`: regras puras (testadas no Node).

## O que aparece

- **Topo:** X para fechar, o anel do logo fechado com o check (entra com uma mola), "Jogo concluído", "Zerou!" e o nome do jogo.
- **"Xh jogadas · Nº jogo zerado":** o número é o total de concluídos (sem contar este) + 1.
- **Estrelas clicáveis**, com a descrição da nota: Não curti, Mais ou menos, Bom, Muito bom e Obra-prima.
- **"O que você achou? (opcional)":** começa com a anotação que o jogo já tinha, para não perder nada.
- **Card "Próximo da fila":** o jogo Na fila adicionado há mais tempo. "Começar" muda ele para Jogando na hora e o card mostra "Agora em Jogando". Some se a fila estiver vazia.
- **"Salvar e concluir":** pede a nota (para nunca concluir sem nota), grava a anotação, aplica as regras de status (CONCLUIDO + nota + dataConclusao), reagenda o lembrete e volta para a aba Biblioteca.

## Testes

`tests/concluirJogo.test.mjs`: descrições das notas, próximo da fila, número do zerado e a linha de resumo.
