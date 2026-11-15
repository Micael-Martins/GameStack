# ViewModel da pesquisa

Task: ViewModel da pesquisa (usePesquisaViewModel).

## Objetivo

Separar a lógica da pesquisa de jogos da interface visual.

A tela de Pesquisa será implementada em uma task própria.

## Arquivos

- `src/features/pesquisar/ViewModel/pesquisaController.ts`
- `src/features/pesquisar/ViewModel/usePesquisaViewModel.ts`
- `tests/pesquisaController.test.mjs`

## Integrações existentes

- `buscarJogosRawg()`: consulta a API RAWG.
- `preferencias.ts`: guarda e recupera pesquisas recentes pelo AsyncStorage.
- `Jogo`: modelo compartilhado dos resultados.

O serviço RAWG continua responsável pela obtenção da chave da API
e pelo tratamento das respostas HTTP.

## Estados disponíveis no hook

- `termoDigitado`: texto inserido pelo usuário.
- `termoPesquisado`: última pesquisa enviada.
- `jogos`: jogos encontrados.
- `total`: total informado pela API.
- `pagina`: página atual.
- `temProximaPagina`: indica se há outra página.
- `carregando`: primeira página em carregamento.
- `carregandoMais`: página adicional em carregamento.
- `pesquisou`: indica que uma pesquisa foi concluída, mesmo sem resultados.
- `erro`: mensagem de falha, quando existir.
- `pesquisasRecentes`: histórico armazenado no AsyncStorage.

## Ações disponíveis

- `setTermoDigitado(texto)`: altera o texto do campo.
- `pesquisar(texto?)`: pesquisa jogos, utilizando o texto atual por padrão.
- `selecionarPesquisaRecente(texto)`: repete uma pesquisa.
- `carregarMais()`: busca a próxima página.
- `cancelarPesquisa()`: interrompe a consulta atual.
- `limparPesquisa()`: limpa os resultados e o texto digitado.
- `limparHistorico()`: apaga o histórico de pesquisas recentes.

O histórico usa as funções existentes em `preferencias.ts`,
que limitam a lista a cinco termos e eliminam duplicados.

## Comportamentos importantes

- Termos vazios não acionam a API.
- Uma nova busca cancela a requisição anterior.
- Respostas antigas não substituem os resultados mais novos.
- Jogos duplicados entre páginas são ignorados.
- Falhas ao carregar páginas adicionais preservam os jogos já recebidos.
- Uma busca pode ser repetida após erro.

## Testes

Executar:

    node --test tests/pesquisaController.test.mjs

Também executar:

    npx tsc --noEmit
    npm test

## Próxima etapa

A task "Tela Pesquisa (estado vazio e pesquisas recentes)"
deverá consumir `usePesquisaViewModel()` para apresentar
os controles e resultados ao usuário.

Nenhuma tela do aplicativo foi alterada nesta entrega.
