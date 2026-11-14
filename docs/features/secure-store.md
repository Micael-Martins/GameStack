# Chave da RAWG no SecureStore

`src/data/secure/credenciais.ts` guarda a chave da API RAWG no SecureStore (Keychain no iOS, Keystore no Android). As regras ficam em `src/data/secure/regrasCredenciais.ts`, sem depender do Expo, para poderem ser testadas no Node.

## API

- `obterChaveApi()`: lê a chave do SecureStore. Na primeira execução (ou se a chave do `.env` for trocada), copia `EXPO_PUBLIC_RAWG_KEY` do `.env` e salva. Sem chave em lugar nenhum, lança `ChaveApiAusenteError` com uma mensagem clara.
- `apagarChaveApi()`: apaga a chave do SecureStore (usado no "Apagar todos os dados").
- No navegador o SecureStore não existe; lá a chave vem direto do `.env`.

O `rawgService` usa `obterChaveApi()` quando a chave não é passada nas opções.

## Por que a chave volta depois de apagada?

Se a chave continuar no `.env`, ela é copiada de novo na próxima busca. Isso é intencional: o `.env` é a fonte da chave, e sem isso a pesquisa pararia de funcionar depois de "Apagar todos os dados". O teste `Apaga: se a chave continuar no .env...` documenta esse comportamento.

## Testes

```bash
npm test
```

Cobrem salvar, consultar, atualizar, erro sem chave, apagar e o caso do navegador (`tests/credenciais.test.mjs`), além do `rawgService` usando a chave vinda do SecureStore (`tests/rawgService.test.mjs`).
