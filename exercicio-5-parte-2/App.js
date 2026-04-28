import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert 
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para salvar os dados no disco
const STORAGE_KEY = '@lista_compras';

function ListaCompras() {
  const [item, setItem] = useState('');
  const [lista, setLista] = useState([]);

  // PASSO 6: Carregar a lista ao abrir o app
  useEffect(() => {
    const carregarLista = async () => {
      try {
        const dados = await AsyncStorage.getItem(STORAGE_KEY);
        if (dados !== null) {
          // PASSO 6: Usando JSON.parse para converter a string de volta para Array
          setLista(JSON.parse(dados));
        }
      } catch (e) {
        Alert.alert("Erro", "Não foi possível carregar sua lista.");
      }
    };

    carregarLista();
  }, []);

  // PASSO 3: Função para Salvar
  const adicionarItem = async () => {
    if (item.trim() === '') return; // Evita itens vazios

    const novoItem = {
      id: Date.now().toString(), // ID único para a FlatList e deleção
      nome: item
    };

    const novaLista = [...lista, novoItem];
    
    try {
      setLista(novaLista); // Atualiza o estado
      // PASSO 3: Salvando no disco com JSON.stringify
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novaLista));
      setItem(''); // Limpa o input
    } catch (e) {
      Alert.alert("Erro", "Falha ao salvar item.");
    }
  };

  // PASSO 5: Remover item usando .filter()
  const removerItem = async (id) => {
    try {
      // Cria uma nova lista sem o item que possui o ID clicado
      const listaFiltrada = lista.filter(i => i.id !== id);
      
      setLista(listaFiltrada); // Atualiza a tela
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(listaFiltrada)); // Atualiza o disco
    } catch (e) {
      Alert.alert("Erro", "Não foi possível remover o item.");
    }
  };

  return (
    <View style={styles.container}>
      {/* PASSO 2: Input e Botão Adicionar */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Ex: Maçã, Pão..."
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity style={styles.botaoAdd} onPress={adicionarItem}>
          <Text style={styles.textoBotaoAdd}>+</Text>
        </TouchableOpacity>
      </View>

      {/* PASSO 4: Renderizar com FlatList */}
      <FlatList
        data={lista}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTexto}>{item.nome}</Text>
            
            {/* PASSO 4 e 5: Botão 'X' para remover */}
            <TouchableOpacity onPress={() => removerItem(item.id)}>
              <Text style={styles.botaoRemover}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// PASSO 1: Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="ListaCompras" 
          component={ListaCompras} 
          options={{ title: 'Minha Lista de Compras' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  inputArea: { flexDirection: 'row', marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16
  },
  botaoAdd: {
    backgroundColor: '#2ecc71',
    width: 50,
    marginLeft: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textoBotaoAdd: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  itemTexto: { fontSize: 18 },
  botaoRemover: { color: '#e74c3c', fontWeight: 'bold', fontSize: 18, padding: 5 }
});