This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Project agent workflow

By default, use all four custom agents in `~/.codex/agents/` for this project's tasks, including future chats: `planejador` (plan), `analista` (investigate requirements and code), `desenvolvedor` (implement), and `revisor` (independently review). Pass each agent the relevant findings from earlier stages. If review finds required fixes, send them back to the developer and review again. The coordinating agent owns the final answer. Follow the responsibilities and constraints in each agent's TOML file.

## Code quality and clarity

Follow Clean Code practices with the expectation that the code may be presented: use clear names, cohesive functions with well-defined responsibilities, and simple, readable solutions consistent with the project. Add clear comments when a specific method, tool, API, or feature needs explanation to make its purpose understandable. Explain the relevant purpose, decision, or behavior; avoid obvious, repetitive comments or comments that merely restate syntax.

## Check current work before development

Before editing code, inspect the current branch, `git status`, local changes, recent commits, and active worktrees. Refresh remote refs with `git fetch --prune origin` when possible, and inspect the current GitHub branches and pull requests. Report any inability to query the remote; stale local refs do not prove that colleagues have no work in progress.

Compare the intended scope with branch changes, pull requests, and Trello cards, including **Fazendo** and **Em revisão (PR)**. Identify work already incorporated into `develop` and possible overlap before implementing. Preserve existing changes, and do not assume a retained remote branch is still active work.

## Keep project instructions current

Compact project glossary: https://app.notion.com/p/418d0be8b172800ea560e9df5d6210c0. It is auxiliary context; verify current code, Git and Trello before acting.

Update the applicable `AGENTS.md` files whenever verified, relevant project state, architecture, rules, or workflow changes. Correct guidance that no longer matches the code. Date and identify the source of temporary observations, and recheck them before acting; an old snapshot must not be treated as permanent truth.

### Git reference checked on 2026-11-15

The structural review branch `revisao-estrutural` was created locally from `origin/develop` at `da5b0ab`. Recheck the remote before development; this branch contains the reviewed RAWG service refactor and its file-by-file architecture checklist.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

Use `bunx` instead of `npx` if the project uses bun (`bun.lock` present).

```bash
npx expo install <package>  # ALWAYS use instead of npm/yarn/pnpm/bun add — resolves SDK-compatible versions
npx expo start              # start the dev server
npx expo lint               # lint
npx tsc --noEmit            # typecheck
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
```

Run lint and typecheck before declaring any task done.

## Navigation & Routing

- In `origin/develop` at `da5b0ab` (checked on 2026-11-15), navigation uses **React Navigation**, with `@react-navigation/native`, bottom tabs, and native stack. The entry point is `index.ts`; navigation definitions are in `src/navigation/TabRouter.tsx` and `src/navigation/tipos.ts`.
- The local `main` checkout is older and still has the former Expo Router structure. Before changing navigation or using its APIs, inspect the active branch's `package.json`, entry point, and navigation files, and follow the implementation on the verified development base.
- Do not infer the current navigation architecture from an older checkout or reintroduce Expo Router based on stale instructions.

## MVVM structure

Shared visual components are in `src/components/` (checked on 2026-11-16). The former development-only component catalog and demo screens were removed. Contracts and manual checks are documented in `docs/features/componentes-jogo.md`.

### Styles (checked on 2026-11-16)

- Design tokens live in `src/theme/`: `cores.ts`, `tipografia.ts`, `espacamentos.ts`, `bordas.ts` (border width and radii). Import them from `src/theme` (`import { cores, bordas } from '../theme'`). Never hard-code a color, font name or radius that exists as a token.
- Patterns repeated across screens (screen background, card, pressed opacity, outline button, secondary text, error text) live in `src/theme/estilosGlobais.ts`.
- Each screen keeps its own styles in `src/features/<feature>/Views/styles/<Name>Screen.styles.ts`. Small components (`src/components/` and `Views/components/`) keep their `StyleSheet` in the same file.
- Each screen has one ViewModel named after it (`<Name>Screen` → `use<Name>ViewModel`); shared game rules live in the Zustand store (`src/store/`) and `regrasStatus.ts`.

Keep the product's MVVM responsibilities: models define types, data modules own persistence and services, view models own screen logic, and views display data. In `origin/develop` at `da5b0ab` (checked on 2026-11-15), shared models are in `src/models/`, SQLite code is in `src/data/db/`, and feature directories use `src/features/<feature>/Views`, `ViewModel`, and `Model`. Recheck the active branch and follow its existing organization before adding files.

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
