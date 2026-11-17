// Um jogo como o app usa (já convertido da RAWG). Ainda não está na biblioteca.
export interface Jogo {
    id: string; // "rawg-<id>"
    apiId: string; // id do jogo na RAWG
    origemAPI: string; // de onde veio ("RAWG")
    nome: string;
    imagemURL: string | null;
    genero: string;
    desenvolvedora: string;
    anoLancamento: number | null;
    tempoMedio: number; // horas médias para terminar (0 quando a RAWG não sabe)
    plataformas: string[];
}