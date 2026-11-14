# Chave da RAWG no SecureStore

`src/data/secure/credenciais.ts` guarda a chave da API RAWG no SecureStore (Keychain no iOS, Keystore no Android).

## API

- `obterChaveApi()`: lê a chave do SecureStore. Na primeira execução (ou se a chave do `.env` for trocada), copia `EXPO_PUBLIC_RAWG_KEY` do `.env` e salva. Sem chave, lança `ChaveApiAusenteError` com uma mensagem clara.
- `apagarChaveApi()`: apaga a chave (usado no "Apagar todos os dados").
- No navegador o SecureStore não existe; lá a chave vem direto do `.env`.

## Próximo passo

O `rawgService` (PR #9) deve chamar `obterChaveApi()` em vez de ler `process.env` diretamente.
