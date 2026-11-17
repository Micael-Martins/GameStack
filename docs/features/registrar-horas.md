# Registrar horas

Tela 08 do protótipo. Abre pelo "Registrar horas" da Home (card "Jogando agora") e dos Detalhes.

Decisão do cartão: o progresso é medido em **horas informadas pelo usuário**. A barra é só uma estimativa pelo tempo médio da RAWG.

Arquivos (MVVM):

- `Views/RegistrarHorasScreen.tsx`
- `ViewModel/useRegistrarHorasViewModel.ts`: minutos iniciais, minutos atuais e o histórico das mudanças (para o "Desfazer").
- `Model/registroHoras.ts`: regras puras (testadas no Node).

## O que aparece

- **Cabeçalho:** "Registrar horas" com o nome do jogo embaixo.
- **Card central:** "Tempo total" grande, "+Xh nesta sessão" (quando aumentou) ou "Antes: Xh", a barra e "X% do tempo médio" / "~Xh em média". Sem tempo médio, a barra some e aparece um aviso.
- **"Quanto você jogou hoje?":** botões +30min, +1h e +2h, que somam ao total, e "Desfazer", que volta a última mudança.
- **"Ou digite o total que aparece no console":** substitui o total (aceita 44, 44,5 e 0). Vale ao sair do campo, ao apertar Enter ou ao salvar; também pode ser desfeito.
- **Anotação (opcional):** começa com a anotação que o jogo já tinha.
- **"Salvar progresso":** grava os minutos e a anotação, e **se o jogo estava Na fila, ele passa para Jogando** (pelas regras de status da store). Reagenda o lembrete e volta.

## Validação

Não aceita valor negativo, vazio ou texto no campo do total. Toques repetidos durante o salvamento são ignorados.

## Testes

`tests/registroHoras.test.mjs`: somas, desfazer, substituir o total, validação do campo, linha da sessão e percentual do tempo médio.
