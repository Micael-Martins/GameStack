import { useEffect, useState } from "react";

import { apagarDadosDoBanco } from "../../../data/db/database";
import {
  obterUsuario,
  salvarLembretes,
  salvarPerfil,
} from "../../../data/db/usuarioRepository";
import { apagarChaveApi } from "../../../data/secure/credenciais";
import {
  cancelarLembretes,
  pedirPermissao,
  reagendarLembrete,
} from "../../../data/services/notificacaoService";
import { HORARIO_LEMBRETE_PADRAO } from "../../../data/services/regrasLembrete";
import { limparTudo } from "../../../data/storage/preferencias";
import { Usuario } from "../../../models/Usuario";
import { useBibliotecaStore } from "../../../store/bibliotecaStore";
import { horarioValido, mascararHorario } from "../Model/horario";

const NOME_PADRAO = "Jogador";

// Toda a lógica da tela Configurações (tela 09). A View só mostra o que este hook devolve.
export function useConfiguracoesViewModel() {
  const totalJogos = useBibliotecaStore((s) => s.jogos.length);
  const limparStore = useBibliotecaStore((s) => s.limpar);

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nome, setNome] = useState("");
  const [horario, setHorario] = useState(HORARIO_LEMBRETE_PADRAO);
  const [erroHorario, setErroHorario] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [apagando, setApagando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [tentativa, setTentativa] = useState(0);

  // Lê o usuário do SQLite e permite uma nova tentativa em caso de falha.
  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErroCarregamento(null);

    obterUsuario()
      .then((u) => {
        if (!u) throw new Error("Usuário não encontrado.");
        if (!ativo) return;

        setUsuario(u);
        setNome(u.nome);
        setHorario(u.horarioNotificacao);
      })
      .catch((e) => {
        console.warn("Erro ao ler o usuário.", e);
        if (ativo) {
          setErroCarregamento("Não foi possível carregar as configurações.");
        }
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [tentativa]);

  const lembretesAtivos = usuario?.notificacaoAtiva ?? false;

  // ---------- Perfil ----------
  async function salvarNome(): Promise<void> {
    if (!usuario) return;
    const limpo = nome.trim() || NOME_PADRAO;
    setNome(limpo);
    if (limpo === usuario.nome) return;
    try {
      await salvarPerfil(limpo, usuario.notificacaoAtiva);
      setUsuario({ ...usuario, nome: limpo });
    } catch (e) {
      console.warn("Erro ao salvar o nome.", e);
      setAviso("Não foi possível salvar o nome.");
    }
  }

  // ---------- Lembretes ----------
  async function alternarLembretes(ligar: boolean): Promise<void> {
    if (!usuario) return;
    setAviso(null);
    if (ligar && !(await pedirPermissao())) {
      setAviso(
        "Permita as notificações nos ajustes do celular para receber os lembretes.",
      );
      return;
    }
    try {
      await salvarLembretes(ligar, usuario.horarioNotificacao);
      setUsuario({ ...usuario, notificacaoAtiva: ligar });
      if (ligar) await reagendarLembrete();
      else await cancelarLembretes();
    } catch (e) {
      console.warn("Erro ao salvar os lembretes.", e);
      setAviso("Não foi possível salvar os lembretes.");
    }
  }

  function alterarHorario(texto: string) {
    setHorario(mascararHorario(texto));
    setErroHorario(null);
  }

  async function salvarHorario(): Promise<void> {
    if (!usuario) return;
    if (!horarioValido(horario)) {
      setErroHorario("Use o formato HH:MM, como 19:00.");
      return;
    }
    if (horario === usuario.horarioNotificacao) return;
    try {
      await salvarLembretes(usuario.notificacaoAtiva, horario);
      setUsuario({ ...usuario, horarioNotificacao: horario });
      await reagendarLembrete();
    } catch (e) {
      console.warn("Erro ao salvar o horário.", e);
      setAviso("Não foi possível salvar o horário.");
    }
  }

  // ---------- Apagar todos os dados ----------
  // Limpa as 3 persistências (SQLite, AsyncStorage e SecureStore), os lembretes e a store.
  async function apagarTudo(): Promise<boolean> {
    setApagando(true);
    setAviso(null);
    try {
      await cancelarLembretes();
      await apagarDadosDoBanco();
      await limparTudo();
      await apagarChaveApi();
      limparStore();
      return true;
    } catch (e) {
      console.warn("Erro ao apagar os dados.", e);
      setAviso("Não foi possível apagar todos os dados. Tente de novo.");
      return false;
    } finally {
      setApagando(false);
    }
  }

  return {
    carregado: usuario !== null,
    carregando,
    erroCarregamento,
    tentarNovamente: () => setTentativa((atual) => atual + 1),
    nome,
    setNome,
    salvarNome,
    lembretesAtivos,
    alternarLembretes,
    horario,
    alterarHorario,
    salvarHorario,
    erroHorario,
    aviso,
    totalJogos,
    apagando,
    apagarTudo,
  };
}
