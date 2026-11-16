# Tela Configurações

Tela 09 do protótipo. Abre pela engrenagem da Home (`navigation.navigate('Configuracoes')`).

Arquivos (MVVM):

- `src/features/configuracoes/Views/ConfiguracoesScreen.tsx`: só a interface.
- `src/features/configuracoes/ViewModel/useConfiguracoesViewModel.ts`: lê e salva o usuário no SQLite.
- `src/features/configuracoes/Model/horario.ts`: máscara e validação do horário "HH:MM".

## Seções

- **Perfil:** editar o nome (salva ao sair do campo; vazio vira "Jogador").
- **Lembretes:** o Interruptor liga ou desliga (`notificacaoAtiva`). O horário (`horarioNotificacao`) só aparece com os lembretes ligados. Ligar pede permissão e reagenda o lembrete; desligar cancela; mudar o horário reagenda.
- **Dados:** total de jogos (da store), "Fonte dos dados: RAWG" e "Apagar todos os dados".

## Apagar todos os dados

Pede confirmação e então:

1. cancela os lembretes;
2. SQLite: apaga os jogos e volta o usuário ao padrão (`APAGAR_DADOS` em `esquema.ts`);
3. AsyncStorage: `limparTudo()`;
4. SecureStore: `apagarChaveApi()`;
5. esvazia a store (`limpar()`);
6. volta para a tela de Boas-vindas com `navigation.reset`.

## Notificações

O `src/data/services/notificacaoService.ts` (pedirPermissao, cancelarLembretes, reagendarLembrete, configurarNotificacoes) entrou aqui porque a tela precisa dele. As regras puras ficam em `regrasLembrete.ts` (com a constante `MODO_TESTE`). O App já reagenda o lembrete ao abrir. Os 5 dias contam a partir da `ultimaInteracao` do jogo "Jogando" mais recente (abrir o app sem jogar não empurra o lembrete); se já passaram, o lembrete vai para o próximo horário escolhido. Título: "GameStack"; texto: "Há quanto tempo você não salva o mundo em [jogo]? Vai jogar um pouco!".

Fica para o cartão de Notificações: reagendar ao registrar horas, ao mudar status e ao remover; pedir permissão na Boas-vindas; tocar na notificação abrir "Registrar horas".

## Testes

`tests/configuracoes.test.mjs` (horário, data e mensagem do lembrete, SQL de apagar) e o teste do `limpar()` em `tests/bibliotecaStore.test.mjs`.
