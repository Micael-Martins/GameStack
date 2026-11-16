# Revisão arquitetural do GameStack

Branch: `revisao-estrutural` · Base: `develop` em `da5b0ab` · Escopo: arquivos-fonte TypeScript/TSX do aplicativo.

**Total: 95 arquivos** — 93 em `src/`, mais `App.tsx` e `index.ts`.

A checklist abaixo enumera cada arquivo-fonte revisado quanto à camada MVVM e à coesão de responsabilidades. Arquivos `.mjs`, configuração, documentação e recursos binários não entram nessa contagem.

## Contagem por camada

- `components`: 22
- `data`: 14
- `features`: 41
- `models`: 6
- `navigation`: 2
- `raiz`: 2
- `store`: 3
- `theme`: 4
- `utils`: 1

## Checklist arquivo a arquivo

- [x] `App.tsx`
- [x] `index.ts`
- [x] `src/components/BarraProgresso.tsx`
- [x] `src/components/Cabecalho.tsx`
- [x] `src/components/CampoTexto.tsx`
- [x] `src/components/Capa.tsx`
- [x] `src/components/CardJogo.tsx`
- [x] `src/components/CardResultado.tsx`
- [x] `src/components/ChipFiltro.tsx`
- [x] `src/components/EstadoCarregando.tsx`
- [x] `src/components/EstadoVazio.tsx`
- [x] `src/components/Estrelas.tsx`
- [x] `src/components/Fogos.tsx`
- [x] `src/components/Interruptor.tsx`
- [x] `src/components/PrimaryButton.styles.tsx`
- [x] `src/components/PrimaryButton.tsx`
- [x] `src/components/StatusChip.tsx`
- [x] `src/components/TesteComponentesScreen.tsx`
- [x] `src/components/TituloSecao.tsx`
- [x] `src/components/animacoes.tsx`
- [x] `src/components/cardJogoUtils.ts`
- [x] `src/components/cardResultadoUtils.ts`
- [x] `src/components/views/ComponentesDemoScreen.tsx`
- [x] `src/components/views/FormularioDemoScreen.tsx`
- [x] `src/data/db/bibliotecaRepository.ts`
- [x] `src/data/db/bibliotecaRepositoryBase.ts`
- [x] `src/data/db/database.ts`
- [x] `src/data/db/database.web.ts`
- [x] `src/data/db/esquema.ts`
- [x] `src/data/db/userRepository.ts`
- [x] `src/data/secure/credenciais.ts`
- [x] `src/data/secure/regrasCredenciais.ts`
- [x] `src/data/services/notificationService.ts`
- [x] `src/data/services/rawgHttp.ts`
- [x] `src/data/services/rawgMapper.ts`
- [x] `src/data/services/rawgService.ts`
- [x] `src/data/services/regrasLembrete.ts`
- [x] `src/data/storage/preferencias.ts`
- [x] `src/features/biblioteca/Model/conclusao.ts`
- [x] `src/features/biblioteca/Model/detalhesJogo.ts`
- [x] `src/features/biblioteca/Model/filtrosBiblioteca.ts`
- [x] `src/features/biblioteca/Model/opcoesPainelStatus.ts`
- [x] `src/features/biblioteca/Model/registroHoras.ts`
- [x] `src/features/biblioteca/Model/remocaoJogo.ts`
- [x] `src/features/biblioteca/ViewModel/useBibliotecaViewModel.ts`
- [x] `src/features/biblioteca/ViewModel/useConcluirViewModel.ts`
- [x] `src/features/biblioteca/ViewModel/useDetalhesViewModel.ts`
- [x] `src/features/biblioteca/ViewModel/usePainelMudarStatusViewModel.ts`
- [x] `src/features/biblioteca/ViewModel/useRegistrarHorasViewModel.ts`
- [x] `src/features/biblioteca/ViewModel/useBotaoRemoverViewModel.ts`
- [x] `src/features/biblioteca/Views/BibliotecaScreen.styles.ts`
- [x] `src/features/biblioteca/Views/BibliotecaScreen.tsx`
- [x] `src/features/biblioteca/Views/BotaoRemoverJogo.tsx`
- [x] `src/features/biblioteca/Views/ConcluirJogoScreen.tsx`
- [x] `src/features/biblioteca/Views/DetalhesJogoScreen.styles.ts`
- [x] `src/features/biblioteca/Views/DetalhesJogoScreen.tsx`
- [x] `src/features/biblioteca/Views/PainelMudarStatus.tsx`
- [x] `src/features/biblioteca/Views/RegistrarHorasScreen.tsx`
- [x] `src/features/configuracoes/Model/horario.ts`
- [x] `src/features/configuracoes/ViewModel/useConfiguracoesViewModel.ts`
- [x] `src/features/configuracoes/Views/ConfiguracoesScreen.tsx`
- [x] `src/features/home/ViewModel/useInicioViewModel.ts`
- [x] `src/features/home/Views/InicioScreen.styles.ts`
- [x] `src/features/home/Views/InicioScreen.tsx`
- [x] `src/features/home/Views/components/CardDestaque.tsx`
- [x] `src/features/home/Views/components/CardFilaVazia.tsx`
- [x] `src/features/home/Views/components/CarrosselJogando.tsx`
- [x] `src/features/home/Views/components/FaixaResumo.tsx`
- [x] `src/features/home/Views/components/LinhaPopulares.tsx`
- [x] `src/features/onboarding/ViewModel/useOnBoardingViewModel.ts`
- [x] `src/features/onboarding/Views/IlustracaoBoasVindas.tsx`
- [x] `src/features/onboarding/Views/OnBoardingScreen.styles.ts`
- [x] `src/features/onboarding/Views/OnBoardingScreen.tsx`
- [x] `src/features/pesquisar/Model/adicionarJogo.ts`
- [x] `src/features/pesquisar/ViewModel/pesquisaController.ts`
- [x] `src/features/pesquisar/ViewModel/useAdicionarViewModel.ts`
- [x] `src/features/pesquisar/ViewModel/usePesquisaViewModel.ts`
- [x] `src/features/pesquisar/Views/AdicionarJogoScreen.tsx`
- [x] `src/features/pesquisar/Views/PesquisarScreen.tsx`
- [x] `src/models/Estatisticas.ts`
- [x] `src/models/Jogo.ts`
- [x] `src/models/JogoBiblioteca.ts`
- [x] `src/models/RawgJogo.ts`
- [x] `src/models/StatusJogo.ts`
- [x] `src/models/Usuario.ts`
- [x] `src/navigation/TabRouter.tsx`
- [x] `src/navigation/tipos.ts`
- [x] `src/store/bibliotecaStore.ts`
- [x] `src/store/bibliotecaStoreBase.ts`
- [x] `src/store/regrasStatus.ts`
- [x] `src/theme/cores.ts`
- [x] `src/theme/espacamentos.ts`
- [x] `src/theme/index.ts`
- [x] `src/theme/tipografia.ts`
- [x] `src/utils/formatarHoras.ts`

## Resultado

- Fronteiras predominantes seguem MVVM: integração/persistência em `data`, regras puras em `Model`, estado e coordenação de tela em `ViewModel`, apresentação em `Views`/`components`.
- Principal refatoração: conversão dos dados RAWG em `rawgMapper.ts`; transporte HTTP, timeout, cancelamento e normalização de erros em `rawgHttp.ts`; `rawgService.ts` mantém a orquestração dos endpoints e os exports públicos.
- O Revisor aprovou a separação e a preservação dos contratos. Os 36 testes focados em RAWG/pesquisa passaram; `git diff --check` passou.
- O typecheck geral foi tentado, mas o checkout não tem dependências Expo/React Native suficientes para uma confirmação limpa. Não foram feitas mudanças funcionais.
