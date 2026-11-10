import { initDatabase } from '@/src/data/db/database';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [bancoPronto, setBancoPronto] = useState(false);
  const [mensagemTeste, setMensagemTeste] = useState('A inicializar banco de dados...');
  

  useEffect(() => {
  async function prepararBanco() {
    try {
      const db = await initDatabase();
      
      if (!db) {
        setMensagemTeste('SQLite disponível apenas em dispositivo móvel (Expo Go).');
        setBancoPronto(true);
        return;
      }
      
      const usuario = await db.getFirstAsync<{ nome: string }>('SELECT nome FROM usuario LIMIT 1');
      
      if (usuario) {
        setMensagemTeste(`Banco pronto! Utilizador encontrado: ${usuario.nome}`);
      } else {
        setMensagemTeste('Banco pronto, mas utilizador não foi criado.');
      }

      setBancoPronto(true);
    } catch (error) {
      console.error("Erro no SQLite:", error);
      setMensagemTeste('Erro ao iniciar o banco de dados.');
    }
  }

  prepararBanco();
}, []);

  if (!bancoPronto) {
    return (
      <View style={styles.container}>
        <Text>{mensagemTeste}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>SQLite Funcional! 🚀</Text>
      <Text>{mensagemTeste}</Text>
      <Text style={styles.instrucao}>
        Teste: Feche a aplicação (ou recarregue no terminal pressionando 'r') e abra novamente para confirmar que os dados continuam lá.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A0A0A',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 10,
  },
  instrucao: {
    color: '#A3A3A3',
    textAlign: 'center',
    marginTop: 20,
  }
});