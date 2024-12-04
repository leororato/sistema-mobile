import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/Login';
import Inicio from './src/pages/Inicio/Inicio';
import Importadas from './src/pages/Importadas/Importadas';
import initializeDatabase from './src/database/initializeDatabase';
import Coleta from './src/pages/Coleta/Coleta';
import { Image } from 'react-native';
import ColetaSemPl from './src/pages/Coleta/ColetaSemPl';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Importadas"
          component={Importadas}
          options={{
            headerTitle: () => (
              <Image
                source={require('./assets/logo.png')}
                style={{ width: 150, height: 40, resizeMode: 'contain', display: 'flex' }}
              />
            ),
            headerStyle: {
              backgroundColor: '#1780e2',
            },
            headerTitleAlign: 'center',
            headerLeft: () => null
          }}
        />

        <Stack.Screen
          name="Coleta"
          component={Coleta}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="ColetaSemPl"
          component={ColetaSemPl}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="Inicio"
          component={Inicio}
          options={{
            headerTitle: () => (
              <Image
                source={require('./assets/logo.png')}
                style={{ width: 150, height: 40, resizeMode: 'contain', display: 'flex' }}
              />
            ),
            headerStyle: {
              backgroundColor: '#1780e2',
            },
            headerTitleAlign: 'center',
            headerLeft: () => null,
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
