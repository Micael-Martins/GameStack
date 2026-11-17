# CardJogo — normal e compacto

Task do Trello: CardJogo (normal e compacto).

## Objetivo

Criar um componente reutilizável para apresentar jogos da biblioteca
em dois formatos: normal e compacto.

## Arquivos

- `src/components/CardJogo.tsx`
- `src/features/biblioteca/ViewModel/cardJogoUtils.ts`
- `tests/cardJogoUtils.test.mjs`

## Componentes reutilizados

- Capa
- StatusChip
- Estrelas
- BarraProgresso

## Propriedades

- `item`: objeto do tipo JogoBiblioteca.
- `variante`: normal ou compacto.
- `onPress`: callback opcional para selecionar o jogo.

## Variante normal

Apresenta capa, nome, informações secundárias, status,
avaliação, tempo jogado e progresso quando disponível.

## Variante compacta

Apresenta capa menor, nome, status e tempo jogado.

## Cálculo do progresso

A RAWG fornece o tempo médio em horas.
A biblioteca registra o tempo jogado em minutos.

O cálculo converte o tempo médio em minutos:

progresso = minutosJogados / (tempoMedio * 60)

O resultado é limitado entre 0 e 100%.

Se o tempo médio não estiver disponível, a barra não aparece.

## Responsabilidades

O CardJogo é apenas visual.

Não consulta diretamente a RAWG nem acessa SQLite.

A navegação para Detalhes será fornecida pela tela
que utilizar o componente.

## Validação

Comandos:

- `node --test tests/cardJogoUtils.test.mjs`
- `npx tsc --noEmit`
- `npm test`
- `npx expo-doctor`

A validação visual será complementada na Tela Biblioteca.
