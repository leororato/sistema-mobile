import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/Login';
import Inicio from './src/pages/Inicio/Inicio';
import BotaoVoltarCabecalho from './src/components/BotaoVoltarCabecalho/BotaoVoltarCabecalho';
import Importadas from './src/pages/Importadas/Importadas';
import Volumes from './src/pages/Volumes/Volumes';
import initializeDatabase from './src/database/initializeDatabase';
import Coleta from './src/pages/Coleta/Coleta';
import { Image, TouchableOpacity } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Inicio">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{
            headerTitle: 'Início',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#1780E2',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert('Logo clicada')}>
                <Image
                  source={require('./assets/logo.png')}
                  style={{ width: 100, height: 40 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="Coleta"
          component={Coleta}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#1780E2',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert('Logo clicada')}>
                <Image
                  source={require('./assets/logo.png')}
                  style={{ width: 100, height: 40 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Importadas"
          component={Importadas}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#1780E2',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert('Logo clicada')}>
                <Image
                  source={require('./assets/logo.png')}
                  style={{ width: 100, height: 40 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Volumes"
          component={Volumes}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#1780E2',
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () => (
              <TouchableOpacity onPress={() => alert('Logo clicada')}>
                <Image
                  source={require('./assets/logo.png')}
                  style={{ width: 100, height: 40 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
