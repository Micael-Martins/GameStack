import type { StatusJogo } from '../../../models/StatusJogo';

// Regras da tela Adicionar jogo, sem React (testadas no Node).

// Opções de status inicial, na ordem do protótipo. "Jogando" já vem selecionado.
export const STATUS_INICIAL_PADRAO: StatusJogo = 'JOGANDO';
export const OPCOES_STATUS_INICIAL: { status: StatusJogo; rotulo: string }[] = [
  { status: 'NA_FILA', rotulo: 'Quero jogar · Na fila' },
  { status: 'JOGANDO', rotulo: 'Jogando' },
  { status: 'CONCLUIDO', rotulo: 'Concluído' },
  { status: 'ABANDONADO', rotulo: 'Abandonado' },
];

// Regra decidida: "Na fila" começa com 0h, então o campo de horas some.
export function mostraCampoHoras(status: StatusJogo): boolean {
  return status !== 'NA_FILA';
}

// Converte o texto do campo (em horas) para minutos.
// Aceita "12", "12,5" e "12.5"; vazio vira 0. Texto inválido devolve null.
export function horasParaMinutos(texto: string): number | null {
  const limpo = texto.trim().replace(',', '.');
  if (limpo === '') return 0;
  if (!/^\d{1,5}(\.\d{1,2})?$/.test(limpo)) return null;
  return Math.round(Number(limpo) * 60);
}

// Minutos que vão para o banco: Na fila é sempre 0.
export function minutosIniciais(status: StatusJogo, textoHoras: string): number | null {
  return mostraCampoHoras(status) ? horasParaMinutos(textoHoras) : 0;
}
