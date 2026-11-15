import type { JogoBiblioteca } from '../../../models/JogoBiblioteca';
import { formatarData, formatarQuando } from '../../../utils/formatarHoras.ts';

const SEM_DATA = '—';

// Frase ao lado do status, no card de destaque.
export function fraseStatus(item: JogoBiblioteca, agora: Date = new Date()): string {
  switch (item.status) {
    case 'NA_FILA':
      return 'Esperando a sua vez';
    case 'JOGANDO':
      return `Desde ${formatarData(item.dataAdicao)}`;
    case 'CONCLUIDO': {
      if (!item.dataConclusao) return 'Zerado!';
      const quando = formatarQuando(item.dataConclusao, agora);
      // "Zerado hoje", "Zerado ontem", "Zerado há 3 dias" ou "Zerado em 02 nov 2026"
      return quando === 'hoje' || quando === 'ontem' || quando.startsWith('há')
        ? `Zerado ${quando}`
        : `Zerado em ${formatarData(item.dataConclusao)}`;
    }
    case 'ABANDONADO':
      return 'Fica fora da fila';
  }
}

// Linhas da lista de informações. Sem data, mostra "—".
export function linhasInformacoes(item: JogoBiblioteca, agora: Date = new Date()) {
  return [
    { rotulo: 'Adicionado em', valor: formatarData(item.dataAdicao) || SEM_DATA },
    { rotulo: 'Última sessão', valor: formatarQuando(item.ultimaInteracao, agora) || SEM_DATA },
    { rotulo: 'Concluído em', valor: formatarData(item.dataConclusao) || SEM_DATA },
  ];
}

// "Salvar" só tem o que gravar se a anotação mudou (espaços nas pontas não contam).
export function anotacaoMudou(original: string, digitada: string): boolean {
  return original.trim() !== digitada.trim();
}