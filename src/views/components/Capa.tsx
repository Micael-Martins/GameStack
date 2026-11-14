import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { cores, espacamentos } from '../../theme';

export type CapaProps = {
  imagemURL?: string | null;
  tamanho?: 'P' | 'M' | 'G';
  descricao?: string;
};

const larguras = { P: 44, M: 60, G: 100 } as const;

/** Mantém a proporção da capa, inclusive quando a imagem não está disponível. */
export default function Capa({ imagemURL, tamanho = 'M', descricao = 'Capa do jogo' }: CapaProps) {
  const url = imagemURL?.trim() || null;
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null);

  // Uma nova URL deve poder carregar mesmo depois de uma capa anterior ter falhado.
  useEffect(() => setUrlComFalha(null), [url]);

  const exibirImagem = url !== null && urlComFalha !== url;

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={exibirImagem ? descricao : `${descricao} indisponível`}
      style={[styles.capa, { width: larguras[tamanho] }]}
    >
      {exibirImagem ? (
        <Image
          key={url}
          source={{ uri: url }}
          resizeMode="cover"
          style={StyleSheet.absoluteFill}
          accessible={false}
          onError={() => setUrlComFalha(url)}
        />
      ) : (
        <Ionicons
          name="game-controller-outline"
          size={larguras[tamanho] * 0.4}
          color={cores.textoSecundario}
          accessible={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  capa: {
    aspectRatio: 3 / 4,
    borderRadius: espacamentos.p,
    backgroundColor: cores.borda,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
