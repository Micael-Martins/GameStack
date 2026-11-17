// Texto do aviso antes de remover um jogo da biblioteca.
export function textoConfirmacaoRemocao(nome: string) {
  return {
    titulo: `Remover ${nome}?`,
    mensagem: 'As horas e a nota serão perdidas.',
  };
}
