import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/Login';
import Inicio from './src/pages/Inicio/Inicio';
import Importadas from './src/pages/Importadas/Importadas';
import initializeDatabase from './src/database/initializeDatabase';
import Coleta from './src/pages/Coleta/Coleta';

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
            headerShown: false
          }}
        />

        <Stack.Screen
          name="Importadas"
          component={Importadas}
          options={{
            headerShown: false
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
          name="Inicio"
          component={Inicio}
          options={{
            headerShown: false
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
