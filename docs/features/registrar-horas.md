# Registrar horas

## Fluxo

A tela é acessada pela ação **Registrar horas** no card de jogo da Home e nos Detalhes. O usuário informa a duração da nova sessão em horas; o app converte o valor para minutos, soma ao total existente e persiste pelo repositório SQLite via store.

## Arquitetura

- `Model/registroHoras.ts`: valida e converte horas (ponto ou vírgula decimal) para minutos inteiros e calcula o total acumulado.
- `ViewModel/useRegistrarHorasViewModel.ts`: lê o jogo da store, valida a sessão, atualiza o total e reagenda os lembretes.
- `Views/RegistrarHorasScreen.tsx`: mostra o jogo, total atual, campo da nova sessão, prévia do novo total, erros e botão para salvar.
- `navigation/tipos.ts` e `App.tsx`: rota `RegistrarHoras`, identificada pelo ID do jogo.

## Regras

- A entrada é o tempo **desta sessão**, não o total histórico.
- Aceita horas inteiras ou até duas casas decimais, com vírgula ou ponto.
- A sessão deve resultar em pelo menos um minuto; entrada vazia, zero, negativa ou inválida não é salva.
- O total persistido fica em minutos e é atualizado pela função existente da store, que atualiza também a data da última interação.
- Toques repetidos durante o salvamento são ignorados.

## Verificação

`tests/registroHoras.test.mjs` cobre conversão, validação, arredondamento ao minuto e soma ao histórico. No app, registrar uma sessão deve atualizar o total e o progresso exibido na Home e nos Detalhes.
