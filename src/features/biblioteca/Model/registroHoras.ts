// A tela recebe horas decimais e o banco guarda minutos inteiros.
export function converterHorasParaMinutos(texto: string): number | null {
  const valor = texto.trim().replace(',', '.');
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(valor)) return null;

  const minutos = Math.round(Number(valor) * 60);
  return Number.isFinite(minutos) && minutos > 0 ? minutos : null;
}

export function calcularTotalMinutos(minutosAtuais: number, minutosAdicionados: number): number {
  return Math.max(0, Math.floor(minutosAtuais)) + minutosAdicionados;
}
