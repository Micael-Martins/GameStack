import { Jogo } from './Jogo';
import { StatusJogo } from './StatusJogo';

// Um jogo que a pessoa adicionou à biblioteca, com o progresso dela.
export interface JogoBiblioteca {
    id: string;
    jogo: Jogo;
    status: StatusJogo;
    minutosJogados: number;
    nota: number | null; // 1 a 5, só em Concluído ou Abandonado
    anotacao: string;
    dataAdicao: string; // datas em texto ISO ("2026-11-15T12:00:00.000Z")
    dataConclusao: string | null;
    ultimaInteracao: string; // última vez que mexeu no jogo (ordem da lista e lembrete)
}