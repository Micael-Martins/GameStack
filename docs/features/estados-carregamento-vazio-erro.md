# Estados de carregamento, vazio e erro

## Objetivo

Melhorar a estabilidade do aplicativo durante falhas de conexão,
consultas à API e operações de leitura do banco de dados.

## Alterações

- Componente reutilizável EstadoCarregando.
- Estados de carregamento e erro na Home.
- Indicadores para perfil, estatísticas e jogos populares.
- Indicador padronizado na Pesquisa e na Biblioteca.
- Nova tentativa após falha na paginação.
- Carregamento e recuperação de erro nas Configurações.
- Tratamento de falhas na abertura inicial da biblioteca.
- Limite de 10 segundos nas consultas complementares à RAWG.

## Critérios do Trello

| Caso | Tratamento |
| --- | --- |
| Pesquisa sem internet | Mensagem de erro e nova tentativa |
| Pesquisa sem resultados | Estado vazio |
| Biblioteca e filtro vazios | Mensagens e ações de recuperação |
| Home sem jogos em andamento | Mensagem e acesso à fila |
| Jogo sem capa | Imagem substituta |
| Tempo médio zero | Barra de progresso oculta |
| Nomes longos | Limitação de linhas nos cards |
| Carregamento | Indicadores nas operações assíncronas |

## Validação

- 133 testes automatizados aprovados.
- TypeScript sem erros.
- Expo Doctor: 21/21 verificações aprovadas.
- Git diff check sem erros.

Os testes visuais em dispositivo físico permanecem pendentes.

## Escopo

Não altera o SDK do Expo, dependências, estrutura do banco
ou regras de mudança de status.
