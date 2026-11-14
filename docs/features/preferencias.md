# Preferências locais

`src/data/storage/preferencias.ts` concentra as três preferências locais do app. O módulo serializa os valores como JSON, devolve um padrão por chave quando a leitura falha e oferece operações específicas para manter pesquisas recentes.

## API

- `CHAVES`: nomes persistidos para onboarding, pesquisas recentes e último filtro.
- `salvar(chave, valor)` e `ler(chave)`: operações tipadas por preferência.
- `adicionarPesquisaRecente(termo)`: ignora entradas vazias, move o termo para o início, remove duplicatas sem diferenciar maiúsculas e minúsculas e mantém até cinco termos.
- `limparPesquisasRecentes()`: remove os termos recentes.
- `limparTudo()`: remove apenas as chaves declaradas neste módulo.

Os valores iniciais são `false` para onboarding visto, `[]` para pesquisas recentes e `''` para último filtro. Persistência após reiniciar o app depende do armazenamento nativo AsyncStorage; não foi verificada em execução neste ambiente.
