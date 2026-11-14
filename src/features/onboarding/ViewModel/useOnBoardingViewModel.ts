import { useEffect, useState } from 'react';

import { saveProfile } from '../../../data/db/userRepository';
import { markOnboardingSeen } from '../../../data/storage/preferences';
import { buscarCapasPopulares } from '../../../data/services/rawgService';

const DEFAULT_NAME = 'Jogador';

// Toda a lógica da tela de boas-vindas. A View só mostra o que este hook devolve.
// onFinish: o que fazer depois de salvar.
export function useOnBoardingViewModel(onFinish: () => void) {
  const [name, setName] = useState('');
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

    const [covers, setCovers] = useState<string[]>([]);

  // Busca 3 capas ao abrir a tela. Se falhar, a tela segue com os cards coloridos.
  useEffect(() => {
    buscarCapasPopulares(3)
      .then(setCovers)
      .catch((e) => console.warn('Sem capas da RAWG:', e));
  }, []);

  async function start() {
    setSaving(true);
    setError(null);
    try {
      await saveProfile(name.trim() || DEFAULT_NAME, remindersEnabled); 
      await markOnboardingSeen(); 
      onFinish();
    } catch (e) {
      console.error('Erro no onboarding:', e);
      setError('Não foi possível salvar. Tente de novo.');
    } finally {
      setSaving(false);
    }
  }

  return { name, setName, remindersEnabled, setRemindersEnabled, saving, error, start, covers };
}