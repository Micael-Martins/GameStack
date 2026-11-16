import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { semSobrepor } from "../../utils/semSobrepor";
import { jogandoAgora } from "../../store/bibliotecaStoreBase";
import { listarBiblioteca } from "../db/bibliotecaRepository";
import { obterUsuario } from "../db/usuarioRepository";
import {
  calcularDataLembrete,
  HORARIO_LEMBRETE_PADRAO,
  mensagemLembrete,
  MODO_TESTE,
  NOME_APP,
  SEGUNDOS_MODO_TESTE,
} from "./regrasLembrete";

// Notificação local (agendada no próprio aparelho, sem servidor).
// Regra: se um jogo está "Jogando" e o usuário não registra nada há 5 dias,
// recebe um lembrete no horário escolhido. Os 5 dias contam a partir da
// ultimaInteracao do jogo (não da abertura do app). Sempre que o app abre ou
// algo muda, o lembrete é cancelado e agendado de novo com a data certa.

const CANAL_ANDROID = "lembretes";
const disponivel = Platform.OS !== "web";

export interface DadosLembrete {
  jogoId: string;
}

// Chamado uma vez no App.tsx. Se falhar (ex.: limitação do Expo Go), o app
// abre do mesmo jeito, só sem lembretes.
export async function configurarNotificacoes(): Promise<void> {
  if (!disponivel) return;
  try {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(CANAL_ANDROID, {
        name: "Lembretes para jogar",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  } catch (erro) {
    console.warn("Não foi possível configurar as notificações.", erro);
  }
}

async function temPermissao(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

// Chamado na Boas-vindas e quando o usuário liga os lembretes.
export async function pedirPermissao(): Promise<boolean> {
  if (!disponivel) return false;
  try {
    if (await temPermissao()) return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === "granted";
  } catch (erro) {
    console.warn("Não foi possível pedir permissão de notificação.", erro);
    return false;
  }
}

// Só o atualizarAgora usa. De fora, use atualizarLembrete (que respeita a fila).
async function cancelarLembretes(): Promise<void> {
  if (!disponivel) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (erro) {
    console.warn("Não foi possível cancelar os lembretes.", erro);
  }
}

// Deixa o lembrete igual ao que está salvo: cancela o que estava agendado e,
// se os lembretes estiverem ligados, com permissão e com um jogo "Jogando",
// agenda um novo. Desligado ou banco vazio: só cancela.
async function atualizarAgora(): Promise<void> {
  if (!disponivel) return;
  try {
    await cancelarLembretes();

    const usuario = await obterUsuario();
    if (!usuario?.notificacaoAtiva) return;
    if (!(await temPermissao())) return;

    const jogo = jogandoAgora(await listarBiblioteca());
    if (!jogo) return;

    const dados: DadosLembrete = { jogoId: jogo.id };
    const trigger: Notifications.NotificationTriggerInput = MODO_TESTE
      ? {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: SEGUNDOS_MODO_TESTE,
          channelId: CANAL_ANDROID,
        }
      : {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: calcularDataLembrete(
            usuario.horarioNotificacao || HORARIO_LEMBRETE_PADRAO,
            new Date(jogo.ultimaInteracao),
          ),
          channelId: CANAL_ANDROID,
        };

    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOME_APP,
        body: mensagemLembrete(jogo.jogo.nome),
        data: { ...dados },
      },
      trigger,
    });
  } catch (erro) {
    console.warn("Não foi possível agendar o lembrete.", erro);
  }
}

// Versão usada pelo app (abrir o app, store, Configurações, Boas-vindas).
// Uma atualização de cada vez: se pedirem outra enquanto uma roda (ex.: concluir
// salva as horas e depois o status, ou o usuário desliga os lembretes no meio),
// a nova espera e roda por último, lendo o banco já atualizado. Assim não sobra
// lembrete duplicado nem lembrete agendado com os lembretes desligados.
export const atualizarLembrete = semSobrepor(atualizarAgora);