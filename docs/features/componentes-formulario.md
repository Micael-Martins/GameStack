# Componentes de formulário e estrutura

Cartão: https://trello.com/c/tpqPUahj — implementação baseada no protótipo de alta fidelidade (onboarding, adicionar jogo, registrar horas, configurações e concluir).

- `CampoTexto`: aceita propriedades de TextInput, label e sufixo opcionais. O sufixo fica fora do valor editável. Foco muda a borda para branca; preserva callbacks do consumidor. Use `keyboardType="decimal-pad"` para horas e `multiline` para anotações.
- `Interruptor`: controlado por `value` e `onValueChange`; trilho branco e botão preto quando ligado. Área mínima 44px, papel switch, estado checked/disabled e rótulo obrigatório. Desenho próprio mantém o visual uniforme entre plataformas.
- `Cabecalho`: título, subtítulo opcional, retorno por callback com área mínima 44px e ação direita opcional. A tela decide o destino da navegação e fornece acessibilidade para sua ação.
- `TituloSecao`: título cinza em caixa alta e link opcional `{ texto, onPress }`.

Os componentes ficam em `src/views/components`, exibem dados e emitem eventos; regras e persistência pertencem aos ViewModels e data.

## Conferência manual

Execute `EXPO_PUBLIC_FORMULARIO_DEMO=1 npx expo start`. A rota só é registrada em desenvolvimento. Sem a variável, a abertura normal permanece nas abas. A tela contém entradas com placeholder, teclado decimal/sufixo, multiline, interruptores ligado/desligado/desabilitado, retorno, subtítulo e ações.

1. Edite as entradas e confira que horas não inclui o sufixo no valor; foque/desfoque e confira bordas.
2. Alterne lembretes e confira visual/estado com VoiceOver ou TalkBack; o exemplo desabilitado não deve responder.
3. Acione Ver todos e a ação do cabeçalho; confira mensagem, retorno e teclado em telas pequenas.
4. Confira fontes ampliadas e iOS/Android. A tela é um catálogo de componentes, não uma tela de produto do protótipo.

Validação em runtime e leitores de tela depende de execução em dispositivo; não presumir aprovação a partir da análise estática.

## Verificações executadas em 14/11/2026

- `git diff --check`: passou.
- TypeScript estrito isolado de CampoTexto, Interruptor e TituloSecao: passou.
- TypeScript completo: bloqueado por módulos ausentes no node_modules disponível (fontes, React Navigation, vector-icons, SQLite e Crypto); não valida integralmente cabeçalho, demo ou integração.
- `CI=1 expo lint`: falhou antes da análise por falta de configuração ESLint e módulo expo-sqlite. Nenhuma configuração nova foi introduzida.
- Execução visual e leitores de tela: pendentes.
