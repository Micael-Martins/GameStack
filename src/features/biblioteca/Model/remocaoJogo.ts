export interface DependenciasRemocao {
  remover: (id: string) => Promise<void>;
  reagendarLembrete: () => Promise<void>;
}

export function textoConfirmacaoRemocao(nome: string) {
  return {
    titulo: `Remover ${nome}?`,
    mensagem: 'As horas e a nota serão perdidas.',
  };
}

/**
 * A store remove do SQLite e atualiza a lista compartilhada.
 * Depois, o serviço recalcula o lembrete com os jogos restantes.
 */
export async function executarRemocaoJogo(
  id: string,
  dependencias: DependenciasRemocao,
): Promise<void> {
  await dependencias.remover(id);

  try {
    await dependencias.reagendarLembrete();
  } catch (erro) {
    // O jogo já foi removido: não desfazer uma exclusão bem-sucedida.
    console.warn('Não foi possível reagendar o lembrete.', erro);
  }
}
