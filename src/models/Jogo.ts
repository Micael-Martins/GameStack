export interface Jogo {
    id: string;
    apiId: string;
    origemId: string;
    nome: string;
    imagemURL: string;
    genero: string;
    desenvolvedora: string;
    anoLancamento: number;
    tempoMedio: number;
    plataformas: string[];
}