// Regras do lembrete dos 5 dias, sem depender do Expo (testadas no Node).

export const NOME_APP = 'GameStack';

// true = o lembrete chega 1 minuto depois de agendado (para demonstrar na apresentação).
export const MODO_TESTE = false;
export const DIAS_LEMBRETE = 5;
export const SEGUNDOS_MODO_TESTE = 60;
export const HORARIO_LEMBRETE_PADRAO = '19:00';

function lerHorario(horario: string): [number, number] {
  const [horas, minutos] = horario.split(':').map(Number);
  return [Number.isFinite(horas) ? horas : 19, Number.isFinite(minutos) ? minutos : 0];
}

// Data do lembrete: 5 dias depois da última interação com o jogo, no horário
// "HH:MM" escolhido. Abrir o app sem jogar não empurra o lembrete, porque a
// conta parte da ultimaInteracao, não de quando o app abriu.
// Se essa data já passou (o jogo está parado há mais de 5 dias), o lembrete
// vai para o próximo horário escolhido: hoje, se ainda não passou, ou amanhã.
export function calcularDataLembrete(
  horario: string,
  ultimaInteracao: Date,
  agora: Date = new Date(),
  dias: number = DIAS_LEMBRETE,
): Date {
  const [horas, minutos] = lerHorario(horario);

  const data = new Date(ultimaInteracao);
  data.setDate(data.getDate() + dias);
  data.setHours(horas, minutos, 0, 0);
  if (data > agora) return data;

  const proxima = new Date(agora);
  proxima.setHours(horas, minutos, 0, 0);
  if (proxima <= agora) proxima.setDate(proxima.getDate() + 1);
  return proxima;
}

export function mensagemLembrete(nomeJogo: string): string {
  return `Há quanto tempo você não salva o mundo em ${nomeJogo}? Vai jogar um pouco!`;
}
