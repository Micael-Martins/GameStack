# Tela Biblioteca

A tela `src/features/biblioteca/Views/BibliotecaScreen.tsx` lista os jogos persistidos na biblioteca, mostra a quantidade total, permite buscar pelo nome e filtrar por status. Os cards reutilizam `CardJogo` e abrem a tela Detalhes já registrada na navegação principal.

## Organização

- `Model/filtrosBiblioteca.ts`: filtra a coleção por status e termo e conta os itens por status.
- `ViewModel/useBibliotecaViewModel.ts`: lê o estado global da biblioteca, recarrega ao voltar para a aba e persiste o último filtro no AsyncStorage.
- `Views/BibliotecaScreen.tsx`: exibe busca, filtros, cartões, carregamento, erro e estados vazios.

A tela usa a store compartilhada, que lê e atualiza o SQLite pelo repositório existente. Não consulta a RAWG para montar a biblioteca.

## Comportamentos

- Estado vazio oferece navegação para Pesquisa.
- Falha de leitura mostra uma ação para tentar novamente.
- Busca e filtro podem ser combinados; filtros sem resultados têm estado próprio.
- O último filtro selecionado é restaurado em visitas futuras.
- Toque num card abre Detalhes pelo identificador local do item.

## Validação manual

1. Adicione um jogo pela Pesquisa e abra a aba Biblioteca.
2. Confirme que o jogo aparece e que a contagem reflete a quantidade salva.
3. Pesquise parte do nome e combine com cada filtro de status.
4. Toque no cartão e confirme que Detalhes mostra o jogo correto.
5. Volte para Biblioteca após mudar status e confirme a lista e as contagens.
6. Mude o filtro, saia da aba e volte para confirmar que ele foi restaurado.
