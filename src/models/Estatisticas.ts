export interface Estatisticas {
    totalConcluidos: number;
    horasTotais: number;
    quantidadePorStatus: Record<string, number>;
}