# Painel Mudar status

Task do Trello: Painel Mudar status.

## Objetivo

Permitir ao usuário alterar o status de um jogo da biblioteca
sem duplicar as regras de negócio existentes.

## Arquivos

- `src/features/biblioteca/Model/opcoesPainelStatus.ts`
- `src/features/biblioteca/ViewModel/usePainelMudarStatusViewModel.ts`
- `src/features/biblioteca/Views/PainelMudarStatus.tsx`
- `tests/painelMudarStatus.test.mjs`

## Opções

- NA_FILA: Na fila
- JOGANDO: Jogando
- CONCLUIDO: Concluído
- ABANDONADO: Abandonado

## Funcionamento

1. O painel recebe um jogo da biblioteca.
2. Mostra o status atual.
3. Permite selecionar um novo status.
4. Para Concluído ou Abandonado, permite selecionar nota.
5. O usuário confirma ou cancela.
6. O ViewModel chama a store Zustand para salvar.

## Regras

A store utiliza aplicarMudancaStatus, que já existe.

- Concluído registra a data de conclusão.
- Jogando e Na fila limpam nota e data de conclusão.
- Abandonado não possui data de conclusão.
- Avaliações são aceitas somente nos status permitidos.
- Salvar fica desabilitado quando o status não mudou.
- Em caso de erro, o painel permanece aberto.

Esta task não implementa edição isolada da nota de um
jogo cujo status continua igual.

## Integração futura

A Tela Detalhes poderá abrir o componente PainelMudarStatus,
passando o item selecionado e os callbacks de fechamento.

O painel não cria rotas e não altera outras telas.

O reagendamento de notificações depois de mudar o status
continua sendo responsabilidade da task de notificações.

## Validação

- Testes das opções do painel.
- Testes de avaliação e alterações de status.
- TypeScript.
- Suite completa de testes.
- Expo Doctor.

A validação visual será realizada quando o painel for
integrado à Tela Detalhes.
