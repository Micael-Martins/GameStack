// Garante que uma tarefa assíncrona nunca rode duas vezes ao mesmo tempo.
// Se pedirem de novo enquanto ela roda, ela roda só mais uma vez no fim
// (com os dados mais novos). Vários pedidos seguidos viram uma única repetição.
export function semSobrepor(tarefa: () => Promise<void>): () => Promise<void> {
  let rodando: Promise<void> | null = null;
  let repeticao: Promise<void> | null = null;

  function executar(): Promise<void> {
    // Ninguém rodando: começa agora.
    if (!rodando) {
      rodando = tarefa().finally(() => {
        rodando = null;
      });
      return rodando;
    }

    // Já tem uma rodando: agenda uma repetição para quando ela terminar.
    if (!repeticao) {
      repeticao = rodando
        .catch(() => {}) 
        .then(() => {
          repeticao = null;
          return executar();
        });
    }
    return repeticao;
  }

  return executar;
}