// O usuário do app (só existe um, criado no primeiro acesso).
export interface Usuario {
    id: string;
    nome: string;
    notificacaoAtiva: boolean;
    horarioNotificacao: string; // "HH:MM"
}