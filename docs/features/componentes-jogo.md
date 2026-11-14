# Componentes de jogo — cartão #6

Cartão: https://trello.com/c/efI222yg

Os componentes ficam em `src/views/components/` e usam os tokens de `src/theme/`. Eles são visuais: acesso à RAWG, persistência e cálculo de tempo pertencem aos repositórios e ViewModels.

## Capa

```tsx
<Capa imagemURL={jogo.imagemURL} tamanho="M" descricao={`Capa de ${jogo.nome}`} />
```

- `imagemURL?: string | null`: URL da imagem; valores vazios e falhas de carregamento mostram um bloco cinza com ícone de controle.
- `tamanho?: 'P' | 'M' | 'G'`: largura de 44, 60 ou 100 px; o padrão é M. A altura segue a proporção 3:4.
- `descricao?: string`: descrição lida por tecnologias assistivas; padrão “Capa do jogo”. O fallback acrescenta “indisponível”.

O estado de erro é reiniciado quando a URL muda. Isso permite que uma pesquisa reutilize o componente para outro jogo depois de uma imagem quebrada. O `onError` registra a URL que falhou, evitando que um erro de uma requisição antiga esconda a imagem atual.

## BarraProgresso

```tsx
<BarraProgresso valor={fracaoJogada} temTempoMedio={tempoMedioEmMinutos > 0} variante="fina" />
```

- `valor: number`: fração já calculada, normalmente `minutosJogados / tempoMedioEmMinutos`.
- `temTempoMedio: boolean`: deve ser falso quando o tempo médio é ausente ou zero; nesse caso o componente não renderiza.
- `variante?: 'normal' | 'fina'`: altura de 8 ou 5 px; padrão normal.
- `descricao?: string`: nome acessível da barra; padrão “Progresso do jogo”.

O ViewModel deve converter as unidades antes de calcular a fração. O campo `Jogo.tempoMedio` ainda não explicita sua unidade, portanto o componente não faz essa divisão. Valores negativos são limitados a zero; valores acima de 1 são limitados a 100%; `NaN` e infinitos são exibidos como zero. A barra anuncia seu percentual por `accessibilityValue`.

## Estrelas

```tsx
<Estrelas nota={jogo.nota} />
<Estrelas nota={nota} onChange={setNota} />
```

- `nota?: number | null`: nota de 1 a 5. Ausência significa “Sem avaliação”; a exibição protege valores não finitos e limita/arredonda números para 0–5.
- `onChange?: (nota: number) => void`: habilita o modo interativo. Cada toque emite um inteiro entre 1 e 5; o estado continua controlado pelo chamador.

O modo de leitura usa ícones de 14 px e uma descrição acessível única. O modo interativo usa ícones de 28 px em botões de 44×44 px, com rótulos como “3 estrelas” e indicação da nota selecionada.

## Demonstração e validação manual

Execute o app em desenvolvimento (`npm start` ou `npm run web`) e abra a aba **Componentes**. A aba é registrada apenas quando `__DEV__` é verdadeiro. Ela não lê a API nem grava dados.

1. Confira as capas P, M e G e os fallbacks para URL ausente e quebrada.
2. Toque em **Trocar por URL válida** após o erro; a capa verde deve aparecer. A imagem válida é um pequeno PNG embutido, sem dependência de rede.
3. Confira progresso de 0%, 50%, 100%, acima de 100%, negativo e inválido nas duas alturas.
4. Confira que o exemplo sem tempo médio não mostra barra.
5. Toque nas cinco estrelas e confirme a atualização da nota selecionada.
6. Com VoiceOver/TalkBack, confira a descrição das capas, o percentual da barra, a leitura única da nota e os botões “1 estrela” a “5 estrelas”.

A aparência usa o protótipo de alta fidelidade do workspace como referência: fundo escuro, cards discretos e barras/estrelas brancas. O catálogo é uma ferramenta de desenvolvimento, sem alterar as telas de produto ainda pendentes.
