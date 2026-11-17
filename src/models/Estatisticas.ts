// Números da faixa de resumo da Home (calculados no SQLite).
export interface Estatisticas {
    totalConcluidos: number;
    horasTotais: number;
    quantidadePorStatus: Record<string, number>;
}