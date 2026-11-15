# Pesquisa, Resultados e Adicionar jogo

Telas 03, 04 e 05 do protótipo.

## Pesquisa e Resultados (`features/pesquisar/Views/PesquisarScreen.tsx`)

Uma tela só, na aba Pesquisar, usando o `usePesquisaViewModel`:

- **Antes de pesquisar (tela 03):** título, subtítulo "Encontre sua próxima aventura", campo com lupa, "Pesquisas recentes" com ChipFiltro e "Limpar" (some se não houver nenhuma), `EstadoVazio` e o crédito da RAWG.
- **Resultados (tela 04):** depois do Enter. Campo preenchido com borda branca e X para limpar, subtítulo "X resultados para 'termo'" e lista (FlatList) de `CardResultado`, com "carregar mais" ao chegar no fim.
- **Estados:** carregando (indicador), nada encontrado ("Nada encontrado para...") e erro com "Tentar de novo".
- A busca só vai para a RAWG ao apertar Enter ou tocar numa pesquisa recente. Apagar o texto volta para a tela inicial.
- Tocar no "+" abre a tela AdicionarJogo com o `Jogo` escolhido.

## Componentes novos (`src/components`)

- `CardResultado`: jogo da RAWG (ainda não salvo). Capa M, nome, "ano · plataformas · gênero", "~Xh em média" (some se for 0) e o botão "+" (44px) ou "✓ Na biblioteca".
- `EstadoVazio`: caixa tracejada com ícone, título, descrição e botão opcional.
- `CampoTexto` ganhou três props opcionais: `icone`, `onLimpar` (botão X) e `destacado` (borda branca).
- `cardResultadoUtils.ts`: os textos do card (testados no Node).

## Adicionar jogo (`features/pesquisar/Views/AdicionarJogoScreen.tsx`)

- `useAdicionarViewModel`: jogo, status escolhido, horas digitadas, salvando e erro.
- Ao abrir, chama `buscarDetalhes` (novo no `rawgService`) para mostrar a desenvolvedora. Se falhar, mostra sem ela e salva assim mesmo.
- Card: Capa G, nome, "desenvolvedora · ano", "plataformas · gênero" e tempo médio.
- 4 status como botões de rádio, com Jogando já selecionado.
- "Quanto você já jogou? (opcional)" em horas (aceita 12, 12,5 e 12.5). Some em Na fila, que sempre começa com 0h.
- "Adicionar à biblioteca": converte horas em minutos, salva pela store, reagenda o lembrete e volta para a aba Biblioteca. Jogo repetido mostra "Esse jogo já está na sua biblioteca.".
- Regras puras em `features/pesquisar/Model/adicionarJogo.ts`.

## Testes

`tests/pesquisaAdicionar.test.mjs`: textos do CardResultado, status inicial, conversão de horas, Na fila com 0h e `buscarDetalhes`.
