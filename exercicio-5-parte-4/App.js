import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // Opcional: para ícones bonitos

// Chaves para o AsyncStorage
const KEYS = {
  NOTIFICACOES: '@config:notificacoes',
  SOM: '@config:som',
  BIOMETRIA: '@config:biometria',
};

function TelaConfig() {
  // PASSO 2: Estados booleanos
  const [notificacoes, setNotificacoes] = useState(false);
  const [som, setSom] = useState(false);
  const [biometria, setBiometria] = useState(false);

  // PASSO 5: Carregar valores do disco ao abrir a tela
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const values = await AsyncStorage.multiGet([
          KEYS.NOTIFICACOES,
          KEYS.SOM,
          KEYS.BIOMETRIA,
        ]);

        // multiGet retorna [[chave, valor], [chave, valor]...]
        // O valor vem como string "true" ou "false" (ou null)
        if (values[0][1] !== null) setNotificacoes(values[0][1] === 'true');
        if (values[1][1] !== null) setSom(values[1][1] === 'true');
        if (values[2][1] !== null) setBiometria(values[2][1] === 'true');
      } catch (e) {
        Alert.alert("Erro", "Falha ao carregar preferências.");
      }
    };

    carregarConfiguracoes();
  }, []);

  // PASSO 4: Funções Toggle com Persistência
  const toggleNotificacoes = async () => {
    const novoValor = !notificacoes;
    setNotificacoes(novoValor);
    await AsyncStorage.setItem(KEYS.NOTIFICACOES, String(novoValor));
  };

  const toggleSom = async () => {
    const novoValor = !som;
    setSom(novoValor);
    await AsyncStorage.setItem(KEYS.SOM, String(novoValor));
  };

  const toggleBiometria = async () => {
    const novoValor = !biometria;
    setBiometria(novoValor);
    await AsyncStorage.setItem(KEYS.BIOMETRIA, String(novoValor));
  };

  // Componente de linha para organizar a UI
  const ConfigItem = ({ label, value, onToggle }) => (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#2ecc71" : "#f4f3f4"}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Preferências do App</Text>
      
      {/* PASSO 3: Renderizar os Switches */}
      <ConfigItem 
        label="Ativar Notificações" 
        value={notificacoes} 
        onToggle={toggleNotificacoes} 
      />
      <ConfigItem 
        label="Efeitos Sonoros" 
        value={som} 
        onToggle={toggleSom} 
      />
      <ConfigItem 
        label="Usar Biometria" 
        value={biometria} 
        onToggle={toggleBiometria} 
      />
    </View>
  );
}

// Tela placeholder para a outra aba
function TelaHome() {
  return (
    <View style={styles.container}><Text>Página Inicial</Text></View>
  );
}

// PASSO 1: Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = route.name === 'Home' ? 'home' : 'settings';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={TelaHome} />
        <Tab.Screen name="Config" component={TelaConfig} options={{ title: 'Configurações' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, marginTop: 20 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  label: { fontSize: 16, color: '#333' }
});