// Campo de horário "HH:MM" das Configurações.

// Coloca os ":" sozinho enquanto o usuário digita: "1930" vira "19:30".
export function mascararHorario(texto: string): string {
  const digitos = texto.replace(/\D/g, '').slice(0, 4);
  return digitos.length <= 2 ? digitos : `${digitos.slice(0, 2)}:${digitos.slice(2)}`;
}

// Aceita de 00:00 a 23:59.
export function horarioValido(horario: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(horario);
}
