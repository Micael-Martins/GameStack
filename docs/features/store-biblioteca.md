# Store Zustand da biblioteca

Arquivos:

- `src/store/bibliotecaStoreBase.ts`: a store em si (sem Expo), mais os seletores.
- `src/store/bibliotecaStore.ts`: liga a store ao repositório SQLite e exporta o hook.

A lista de jogos fica num lugar só. Home, Biblioteca e Detalhes leem da store, então uma mudança feita numa tela aparece nas outras na hora, sem recarregar.

## Estado e ações

| Campo | O que é |
| --- | --- |
| `jogos` | lista da biblioteca, da última interação para a mais antiga |
| `carregando` / `erro` | estado do `carregar()` |
| `carregar()` | busca tudo do repositório (uma vez, ao abrir o app) |
| `adicionar(jogo, status, minutos?)` | adiciona e põe no topo; lança `JogoJaNaBibliotecaError` se repetir |
| `atualizar(id, { minutosJogados?, anotacao? })` | grava horas e/ou anotação |
| `mudarStatus(id, novoStatus, nota?)` | aplica as [regras de status](regras-status.md) e grava |
| `remover(id)` | apaga do banco e da lista |

Depois de cada ação a store relê o jogo do banco, então a lista sempre bate com o SQLite.

## Uso nas telas

```tsx
import { jogandoAgora, recentes, useBibliotecaStore } from '../store/bibliotecaStore';

const jogos = useBibliotecaStore((s) => s.jogos);
const mudarStatus = useBibliotecaStore((s) => s.mudarStatus);

const destaque = useMemo(() => jogandoAgora(jogos), [jogos]);
const ultimos = useMemo(() => recentes(jogos, 3, destaque?.id), [jogos, destaque]);
```

Seletores prontos (funções puras sobre a lista):

- `jogandoAgora(jogos)`: o jogo "Jogando" com interação mais recente (card de destaque da Home), ou `null`.
- `recentes(jogos, n, excluirId?)`: os `n` mais recentes, podendo pular o destaque.
- `porStatus(jogos, status)`: filtro das abas da Biblioteca.

## Pendente

- O `App.tsx` precisa chamar `carregarBiblioteca()` depois do `obterBanco()`. Não mexi no App para não dar conflito com o que o time está fazendo.
- A tela "Adicionar" ainda não existe; quando existir, ela deve chamar `adicionar` da store em vez do repositório.

## Testes

`tests/bibliotecaStore.test.mjs` usa a store com o repositório de verdade num SQLite em memória (`node:sqlite`).

```bash
npm test
```
