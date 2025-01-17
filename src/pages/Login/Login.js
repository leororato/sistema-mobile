import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import api from '../../../axiosConfig';
import * as SecureStore from 'expo-secure-store';
import internetStatus from '../../components/VerificarConexaoComInternet/InternetStatus';
import Icon from 'react-native-vector-icons/AntDesign';
import { fetchPackingListsQuantidade } from '../../database/services/packingListService';
import axios from 'axios';

export default function Login({ navigation }) {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [contextLoading, setContextLoading] = useState(false);
  const [contextErrorMessage, setContextErrorMessage] = useState(false);

  const VerificarSeExisteImportada = async () => {
    let rota;
    const quantidade = await fetchPackingListsQuantidade();
    console.log('quantidade: ', quantidade);
    rota = quantidade > 0 ? 'Importadas' : 'Inicio';
    navigation.replace(rota);
  };

  const handleLogin = async () => {
    setContextLoading(true);
    const statusInternet = internetStatus();
    if (statusInternet) {
      try {
        const response = await axios.post('http://192.168.1.238:8080/auth/login', {
          login: login,
          senha: senha,
        });
        console.log('resp: ', response.data);
        await SecureStore.deleteItemAsync('token');
        await SecureStore.deleteItemAsync('id');
        await SecureStore.deleteItemAsync('nivelAcesso');
        await SecureStore.deleteItemAsync('nome');

        await SecureStore.setItemAsync('token', response.data.token);
        await SecureStore.setItemAsync('id', JSON.stringify(response.data.id));
        await SecureStore.setItemAsync('nivelAcesso', JSON.stringify(response.data.nivelAcesso));
        await SecureStore.setItemAsync('nome', response.data.nome);

        VerificarSeExisteImportada();

      } catch (error) {
        setContextErrorMessage(error?.response?.data);
        console.log(error.response)

      } finally {
        setContextLoading(false);
      }
    } else {
      Alert.alert(
        'Atenção',
        'Não há conexão com a internet. Não foi possível fazer login.',
        [{ text: 'OK', onPress: () => { }, style: 'cancel' }]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Animated.Image
            source={require('../../../assets/logo-inicio.png')}
            style={{
              width: 200,
              height: 200,
              resizeMode: 'contain',
            }}
          />
          <View style={styles.iconContainer}>
            <Icon name="user" size={50} color="#000" />
          </View>
        </View>

        <Text style={styles.title}>Login</Text>

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

        {contextErrorMessage && (
          <View style={{ width: '80%', marginTop: -15 }}>
            <Text style={{ color: 'red' }}>{contextErrorMessage}*</Text>
          </View>
        )}

        {contextLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.botaoEntrar}>
            <Text style={{ color: '#fff' }}>Entrar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 8,
    borderColor: '#ccc',
    fontSize: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoEntrar: {
    backgroundColor: '#2196F3',
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 4,
  },
});