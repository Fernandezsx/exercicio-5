import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function TelaNovoProduto() {
  // PASSO 3: Estados para valores
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');

  // PASSO 3: Estados para erros
  const [erroNome, setErroNome] = useState(false);
  const [erroPreco, setErroPreco] = useState(false);

  // PASSO 4 e 5: Validação e Feedback
  const salvarProduto = () => {
    let temErro = false;

    // Validação do Nome (Mínimo 3 letras sem contar espaços)
    if (nome.trim().length < 3) {
      setErroNome(true);
      temErro = true;
    } else {
      setErroNome(false);
    }

    // Validação do Preço (Obrigatório e > 0)
    const valorNumerico = parseFloat(preco.replace(',', '.')); // Aceita vírgula ou ponto
    if (!preco || isNaN(valorNumerico) || valorNumerico <= 0) {
      setErroPreco(true);
      temErro = true;
    } else {
      setErroPreco(false);
    }

    // PASSO 6: Sucesso
    if (!temErro) {
      Alert.alert("Sucesso!", "Produto cadastrado com sucesso.");
      
      // Limpa o formulário
      setNome('');
      setPreco('');
      setDescricao('');
      setErroNome(false);
      setErroPreco(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome do Produto *</Text>
      <TextInput
        style={[styles.input, erroNome && styles.inputErro]}
        placeholder="Ex: Teclado Mecânico"
        value={nome}
        onChangeText={setNome}
      />
      {erroNome && <Text style={styles.textoErro}>O nome deve ter pelo menos 3 letras.</Text>}

      <Text style={styles.label}>Preço (R$) *</Text>
      <TextInput
        style={[styles.input, erroPreco && styles.inputErro]}
        placeholder="0.00"
        keyboardType="numeric" // PASSO 2: Teclado numérico
        value={preco}
        onChangeText={setPreco}
      />
      {erroPreco && <Text style={styles.textoErro}>Insira um preço válido maior que zero.</Text>}

      <Text style={styles.label}>Descrição (Opcional)</Text>
      <TextInput
        style={[styles.input, styles.inputDescricao]}
        placeholder="Descreva as características..."
        multiline={true} // PASSO 2: Múltiplas linhas
        numberOfLines={4}
        value={descricao}
        onChangeText={setDescricao}
        textAlignVertical="top" // Garante que o texto comece no topo (Android)
      />

      <TouchableOpacity style={styles.botao} onPress={salvarProduto}>
        <Text style={styles.textoBotao}>Salvar Produto</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// PASSO 1: Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="NovoProduto" 
          component={TelaNovoProduto} 
          options={{ title: 'Cadastrar Produto' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 5,
  },
  inputDescricao: {
    height: 100,
  },
  inputErro: {
    borderColor: '#e74c3c', // Borda vermelha se houver erro
    backgroundColor: '#fff5f5',
  },
  textoErro: {
    color: '#e74c3c',
    fontSize: 12,
    marginBottom: 15,
    fontWeight: '500',
  },
  botao: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 40
  },
  textoBotao: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});