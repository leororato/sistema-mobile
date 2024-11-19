import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/Login';
import Inicio from './src/pages/Inicio/Inicio';
import Conferencia from './src/pages/Conferencia/Conferencia';
import BotaoVoltarCabecalho from './src/components/BotaoVoltarCabecalho/BotaoVoltarCabecalho';
import Importadas from './src/pages/Importadas/Importadas';
import Volumes from './src/pages/Volumes/Volumes';
import { createTable_mv_packinglist } from './src/database/database';
import initializeDatabase from './src/database/initializeDatabase';

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
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Conferência"
          component={Conferencia}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="Importadas"
          component={Importadas}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="Volumes"
          component={Volumes}
          options={({ navigation }) => ({
            headerLeft: () => <BotaoVoltarCabecalho navigation={navigation} />,
            headerTitleAlign: 'center',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
