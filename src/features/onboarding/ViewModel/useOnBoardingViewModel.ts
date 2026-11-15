import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { saveProfile } from '../../../data/db/userRepository';
import { buscarCapasPopulares } from '../../../data/services/rawgService';
import { pedirPermissao, reagendarLembrete } from '../../../data/services/notificationService';
import { CHAVES, salvar } from '../../../data/storage/preferencias';

const DEFAULT_NAME = 'Jogador';

// Toda a lógica da tela de boas-vindas. A View só mostra o que este hook devolve.
// onFinish: o que fazer depois de salvar.
export function useOnBoardingViewModel(onFinish: () => void) {
  const [name, setName] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [covers, setCovers] = useState<string[]>([]);
  const [coversReady, setCoversReady] = useState(false);

  // Busca as capas e baixa as imagens antes de liberar a animação.
  useEffect(() => {
    let finished = false;
    const finish = () => {
      if (!finished) {
        finished = true;
        setCoversReady(true);
      }
    };
    const timeout = setTimeout(finish, 2500);

    buscarCapasPopulares(3)
      .then(async (urls) => {
        await Promise.all(urls.map((url) => Image.prefetch(url).catch(() => false)));
        setCovers(urls);
      })
      .catch((e) => console.warn('Sem capas da RAWG:', e))
      .finally(() => {
        clearTimeout(timeout);
        finish();
      });

    return () => clearTimeout(timeout);
  }, []);

  // Botão "Começar"
  async function start() {
    setSaving(true);
    setError(null);
    try {
      // Lembretes ligados: o celular mostra o alerta "Permitir notificações?".
      // Se a pessoa negar, salvamos como desligado (dá para ligar depois em Configurações).
      let reminders = remindersEnabled;
      if (reminders) {
        reminders = await pedirPermissao();
      }

      await saveProfile(name.trim() || DEFAULT_NAME, reminders);
      await salvar(CHAVES.onboardingVisto, true);
      await reagendarLembrete(); // agenda o lembrete se tiver permissão e jogo "Jogando"
      onFinish();
    } catch (e) {
      setError('Não foi possível salvar. Tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  return { name, setName, remindersEnabled, setRemindersEnabled, saving, error, start, covers, coversReady };
}