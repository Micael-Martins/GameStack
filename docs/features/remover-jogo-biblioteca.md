# Remover jogo da biblioteca

Cartão do Trello:
https://trello.com/c/ZFNzY7zS

## Objetivo

Permitir remover um jogo da biblioteca mediante confirmação.

## Arquivos

- `src/features/biblioteca/Model/remocaoJogo.ts`
- `src/features/biblioteca/ViewModel/useRemoverJogoBiblioteca.ts`
- `src/features/biblioteca/Views/BotaoRemoverJogo.tsx`
- `tests/removerJogoBiblioteca.test.mjs`

## Critérios do Trello

1. Lixeira no canto superior direito da Tela Detalhes.
2. AccessibilityLabel: Remover da biblioteca.
3. Confirmação com nome do jogo e aviso de perda de dados.
4. Após confirmar, remover pela store e voltar à Biblioteca.
5. Reagendar o lembrete quando necessário.

## Funcionamento

O botão apresenta uma confirmação.

Cancelar não chama a função de remoção.

Confirmar chama a store Zustand, que remove o registro
do SQLite e atualiza a lista compartilhada.

Após a remoção, o serviço de notificações recalcula
o lembrete utilizando os jogos restantes.

O callback onRemovido permite à Tela Detalhes
navegar para a Biblioteca.

## Tratamento de erros

- Falha na remoção mantém o usuário na tela.
- O botão informa o erro.
- O botão fica desabilitado durante a operação.
- Falha no reagendamento não desfaz a remoção concluída.

## Integração pendente

A Tela Detalhes ainda não existe na develop utilizada
nesta implementação.

Quando ela for criada, colocar BotaoRemoverJogo no canto
superior direito e fornecer onRemovido para navegar
para a aba Biblioteca.

O componente não altera App.tsx nem a navegação.

## Validação

- node --test tests/removerJogoBiblioteca.test.mjs
- npx tsc --noEmit
- npm test
- npx expo-doctor

O posicionamento visual e o retorno à Biblioteca serão
testados durante a integração com a Tela Detalhes.
