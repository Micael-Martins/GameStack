import { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { saveProfile } from '../../../data/db/userRepository';
import { buscarCapasPopulares } from '../../../data/services/rawgService';
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

  async function start() {
    setSaving(true);
    setError(null);
    try {
      await saveProfile(name.trim() || DEFAULT_NAME, remindersEnabled);
      await salvar(CHAVES.onboardingVisto, true);
      onFinish();
    } catch (e) {
      console.error('Erro no onboarding:', e);
      setError('Não foi possível salvar. Tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  return { name, setName, remindersEnabled, setRemindersEnabled, saving, error, start, covers, coversReady };
}