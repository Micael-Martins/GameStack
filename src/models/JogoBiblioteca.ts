import { Jogo } from './Jogo';
import { StatusJogo } from './StatusJogo';

export interface JogoBiblioteca {
    id: string;
    jogo: Jogo;
    status: StatusJogo;
    minutosJogados: number;
    nota: number | null;
    anotacao: string;
    dataAdicao: string;
    dataConclusao: string | null;
    ultimaInteracao: string;
}