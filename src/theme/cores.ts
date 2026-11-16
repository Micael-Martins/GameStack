// Todas as cores do app. O app é preto e branco: os tons de cinza têm nome pelo
// lugar onde são usados, para ninguém precisar decorar o código da cor.
export const cores = {
  // Fundos
  fundo: '#0A0A0A', // fundo das telas
  fundoProfundo: '#0F0F0F', // um pouco mais claro que o fundo (capa vazia, barra de abas)
  card: '#171717', // fundo dos cards e campos
  fundoClaro: '#FAFAFA', // fundo branco da ilustração das boas-vindas
  sobreposicao: 'rgba(0, 0, 0, 0.72)', // escurece a tela atrás de um painel

  // Bordas e linhas
  borda: '#262626', // borda padrão de cards e chips
  bordaCampo: '#2E2E2E', // borda dos campos de texto
  bordaForte: '#3A3A3A', // bordas tracejadas, rádio desmarcado, interruptor desligado
  bordaTracejada: '#5A5A5A', // contorno mais visível (capa tracejada, botão de engrenagem)
  divisoria: '#222222', // linhas que separam listas e a barra de baixo

  // Textos
  texto: '#FAFAFA', // texto principal (e cor dos botões brancos)
  textoClaro: '#D4D4D4', // rótulos de campo e textos de destaque leve
  textoSecundario: '#A3A3A3', // subtítulos e informações
  textoFraco: '#8A8A8A', // legendas e textos menos importantes
  textoApagado: '#4A4A4A', // números "apagados" (biblioteca vazia)

  // Mensagens
  erro: '#F09595', // único tom com cor: mensagens de erro
} as const;
