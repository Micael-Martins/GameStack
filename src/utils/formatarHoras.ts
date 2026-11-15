// Formatação de tempo usada em todo o app (cards, Home, Detalhes, Registrar horas).

export function formatarHoras(minutos: number): string {
  const total = Number.isFinite(minutos) ? Math.max(0, Math.floor(minutos)) : 0;
  const horas = Math.floor(total / 60);
  const resto = total % 60;

  if (horas === 0 && resto > 0) return `${resto}min`;
  if (resto === 0) return `${horas}h`;
  return `${horas}h ${resto}min`;
}

// Só as horas inteiras, para textos curtos como "12h de ~50h".
export function horasInteiras(minutos: number): number {
  return Number.isFinite(minutos) ? Math.max(0, Math.floor(minutos / 60)) : 0;
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Quando foi a última interação: "hoje", "ontem", "há 3 dias" ou "02 nov".
export function formatarQuando(dataISO: string, agora: Date = new Date()): string {
  const data = new Date(dataISO);
  if (Number.isNaN(data.getTime())) return '';

  // Compara só os dias (ignora as horas), no fuso do aparelho.
  const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dias = Math.round((inicioDoDia(agora) - inicioDoDia(data)) / 86_400_000);

  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'ontem';
  if (dias < 7) return `há ${dias} dias`;
  return `${String(data.getDate()).padStart(2, '0')} ${MESES[data.getMonth()]}`;
}