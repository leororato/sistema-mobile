import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../../../axiosConfig';
import * as SecureStore from 'expo-secure-store';
import { fetchPackingListsQuantidade } from '../../database/services/packingListService';

export default function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');


  const handleLogin = async () => {

    try {
      const response = await api.post('http://192.168.0.122:8080/auth/login', { login: login, senha: senha });
      console.log('resp: ', response.data)
      await SecureStore.setItemAsync('token', response.data.token);
      await SecureStore.setItemAsync('id', JSON.stringify(response.data.id)); 
      await SecureStore.setItemAsync('nivelAcesso', JSON.stringify(response.data.nivelAcesso)); 
      await SecureStore.setItemAsync('nome', response.data.nome);

      console.log('resp: ', response.data )
      navigation.navigate('Inicio');

    } catch (error) {
      console.log("Erro no login: ", error);
    }
  }

  useEffect(() => {
    navegacaoParaInicioOuImportacao();
  }, [])

  const navegacaoParaInicioOuImportacao = async () => {
    const response = await fetchPackingListsQuantidade();
    if (response === 0) {
        navigation.navigate('Inicio');
    } else {
        navigation.navigate('Importadas');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela de Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Login"
        value={login}
        onChangeText={setLogin}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <ActivityIndicator 
      size={24}
      color={"#FFF"}
      />
      
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
