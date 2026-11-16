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

export async function cancelarLembretes(): Promise<void> {
  if (!disponivel) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (erro) {
    console.warn("Não foi possível cancelar os lembretes.", erro);
  }
}

// Cancela o que estava agendado e agenda de novo. Não agenda se os lembretes
// estiverem desligados, sem permissão ou se não houver jogo "Jogando".
async function reagendarAgora(): Promise<void> {
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

// Versão usada pelo app. Duas mudanças seguidas na store (ex.: concluir salva as
// horas e depois o status) pediriam dois reagendamentos ao mesmo tempo; os dois
// cancelariam antes de agendar e o lembrete sairia duplicado. Com semSobrepor
// eles rodam um depois do outro.
export const reagendarLembrete = semSobrepor(reagendarAgora);