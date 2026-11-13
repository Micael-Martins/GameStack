export interface Jogo {
    id: string;
    apiId: string;
    origemAPI: string;
    nome: string;
    imagemURL: string | null;
    genero: string;
    desenvolvedora: string;
    anoLancamento: number | null;
    tempoMedio: number;
    plataformas: string[];
}