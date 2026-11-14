// Regras do lembrete dos 5 dias, sem depender do Expo (testadas no Node).

// true = o lembrete chega 1 minuto depois de agendado (para demonstrar na apresentação).
export const MODO_TESTE = false;
export const DIAS_LEMBRETE = 5;
export const SEGUNDOS_MODO_TESTE = 60;
export const HORARIO_LEMBRETE_PADRAO = '19:00';

// Data do lembrete: daqui a X dias, no horário "HH:MM" escolhido.
export function calcularDataLembrete(horario: string, agora: Date = new Date(), dias: number = DIAS_LEMBRETE): Date {
  const [horas, minutos] = horario.split(':').map(Number);
  const data = new Date(agora);
  data.setDate(data.getDate() + dias);
  data.setHours(Number.isFinite(horas) ? horas : 19, Number.isFinite(minutos) ? minutos : 0, 0, 0);
  return data;
}

export function mensagemLembrete(nomeJogo: string): string {
  return `Há quanto tempo não salvas o mundo em ${nomeJogo}? Vai jogar um pouco!`;
}
