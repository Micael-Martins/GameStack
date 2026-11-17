import { formatarHoras } from '../../../utils/formatarHoras.ts';

// Regras da tela Registrar horas, sem React (testadas no Node).
// O banco guarda minutos inteiros; a tela fala em horas.

// Botões "+30min", "+1h" e "+2h", em minutos.
export const SOMAS_RAPIDAS = [
  { rotulo: '+30min', minutos: 30 },
  { rotulo: '+1h', minutos: 60 },
  { rotulo: '+2h', minutos: 120 },
] as const;

// Campo "Ou digite o total que aparece no console": aceita 44, 44,5 e 44.5.
// Devolve null para vazio, negativo ou texto inválido (0 é aceito).
export function totalDigitadoEmMinutos(texto: string): number | null {
  const valor = texto.trim().replace(',', '.');
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(valor)) return null;
  return Math.round(Number(valor) * 60);
}

// Histórico para o "Desfazer": cada mudança guarda o total de antes.
export interface Progresso {
  minutos: number;
  historico: number[];
}

export function iniciarProgresso(minutosIniciais: number): Progresso {
  return { minutos: Math.max(0, Math.floor(minutosIniciais) || 0), historico: [] };
}

// Botões: somam ao total.
export function somar(progresso: Progresso, minutos: number): Progresso {
  return { minutos: progresso.minutos + minutos, historico: [...progresso.historico, progresso.minutos] };
}

// Campo do console: substitui o total.
export function substituirTotal(progresso: Progresso, minutos: number): Progresso {
  if (minutos === progresso.minutos) return progresso;
  return { minutos, historico: [...progresso.historico, progresso.minutos] };
}

// "Desfazer": volta para o total de antes da última mudança.
export function desfazer(progresso: Progresso): Progresso {
  if (progresso.historico.length === 0) return progresso;
  const historico = progresso.historico.slice(0, -1);
  return { minutos: progresso.historico[progresso.historico.length - 1], historico };
}

// Linha embaixo do total: "+1h 30min nesta sessão" quando aumentou; senão "Antes: 42h 30min".
export function textoSessao(minutosIniciais: number, minutosAtuais: number): string {
  const diferenca = minutosAtuais - minutosIniciais;
  return diferenca > 0 ? `+${formatarHoras(diferenca)} nesta sessão` : `Antes: ${formatarHoras(minutosIniciais)}`;
}

// "85% do tempo médio" (estimativa pelo tempo médio da RAWG, em horas). Pode passar de 100%.
export function percentualDoTempoMedio(minutos: number, tempoMedioHoras: number): number | null {
  if (!Number.isFinite(tempoMedioHoras) || tempoMedioHoras <= 0) return null;
  return Math.round((minutos / (tempoMedioHoras * 60)) * 100);
}
