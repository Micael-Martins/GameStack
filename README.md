# GameStack

Aplicativo mobile para organizar jogos, acompanhar uma biblioteca pessoal e pesquisar novos títulos. O projeto foi desenvolvido com React Native, Expo, TypeScript e Expo Router.

## Tecnologias

- Expo SDK 57
- React Native 0.86
- React 19
- TypeScript
- Expo Router

## Pré-requisitos

Antes de executar o projeto, instale:

- [Node.js](https://nodejs.org/) em uma versão LTS recente, que já inclui o npm;
- [Expo Go](https://expo.dev/go) no celular, caso queira testar em um dispositivo físico;
- Android Studio para executar em um emulador Android; ou
- Xcode, disponível somente no macOS, para executar no simulador do iOS.

Confira se o Node.js e o npm estão disponíveis:

```bash
node --version
npm --version
```

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd GameStack
```

Instale exatamente as dependências registradas no `package-lock.json`:

```bash
npm ci
```

Caso esteja trabalhando em uma cópia sem `package-lock.json`, use:

```bash
npm install
```

## Executando o projeto

Inicie o servidor de desenvolvimento do Expo:

```bash
npm start
```

O terminal exibirá um QR Code. Abra o Expo Go no Android ou a câmera no iOS para executar o aplicativo em um dispositivo físico.

### Android

Com um emulador Android aberto:

```bash
npm run android
```

### iOS

No macOS, com o Xcode instalado:

```bash
npm run ios
```

### Navegador

```bash
npm run web
```

## Comandos úteis

Reiniciar o Expo limpando o cache:

```bash
npx expo start --clear
```

Verificar os tipos do TypeScript:

```bash
npx tsc --noEmit
```

Verificar a configuração e a compatibilidade das dependências:

```bash
npx expo-doctor
```

Corrigir versões de dependências incompatíveis com o SDK do Expo:

```bash
npx expo install --fix
```

Instalar uma biblioteca compatível com a versão atual do Expo:

```bash
npx expo install <NOME_DA_BIBLIOTECA>
```

Parar o servidor de desenvolvimento:

```text
Ctrl + C
```

## Reinstalação das dependências

Se as dependências apresentarem problemas, faça uma instalação limpa:

```bash
rm -rf node_modules
npm ci
```

O diretório `node_modules` não é enviado ao Git. Ele pode ser recriado a qualquer momento com `npm ci`.

## Estrutura principal

```text
GameStack/
├── assets/                  # Imagens e fontes
├── src/
│   ├── app/                 # Rotas do Expo Router
│   ├── components/          # Componentes compartilhados
│   ├── constants/           # Constantes globais
│   └── features/            # Funcionalidades organizadas em MVVM
│       ├── biblioteca/
│       ├── home/
│       └── pesquisar/
├── app.json                 # Configuração do Expo
├── package.json             # Scripts e dependências
└── tsconfig.json            # Configuração do TypeScript
```

## Licença

Consulte o arquivo [LICENSE](./LICENSE).
