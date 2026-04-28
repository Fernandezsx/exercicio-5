import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// PASSO 2, 3, 4 e 5: A tela de Perfil
function TelaPerfil() {
  const [nome, setNome] = useState('');
  const [nomeSalvo, setNomeSalvo] = useState('');

  // PASSO 4: Carregar o nome ao abrir a tela
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const valor = await AsyncStorage.getItem('@meu_nome');
        if (valor !== null) {
          setNomeSalvo(valor);
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar o nome.");
      }
    };

    carregarDados();
  }, []);

  // PASSO 3: Função para Salvar
  const salvarNome = async () => {
    try {
      await AsyncStorage.setItem('@meu_nome', nome);
      setNomeSalvo(nome);
      setNome(''); // Limpa o input após salvar
      Alert.alert("Sucesso", "Nome salvo com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar no armazenamento.");
    }
  };

  // PASSO 5: Função para Apagar
  const apagarNome = async () => {
    try {
      await AsyncStorage.removeItem('@meu_nome');
      setNomeSalvo('');
      Alert.alert("Removido", "O nome foi apagado do dispositivo.");
    } catch (e) {
      Alert.alert("Erro", "Falha ao remover o nome.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {nomeSalvo ? `Bem-vindo de volta, ${nomeSalvo}` : 'Bem-vindo! Digite seu nome:'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu nome aqui..."
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvarNome}>
        <Text style={styles.textoBotao}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoApagar} onPress={apagarNome}>
        <Text style={styles.textoBotao}>Apagar Nome</Text>
      </TouchableOpacity>
    </View>
  );
}

// PASSO 1: Configuração do Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="TelaPerfil" 
          component={TelaPerfil} 
          options={{ title: 'Meu Perfil' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  botaoSalvar: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  botaoApagar: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});