import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/pages/Login/Login';
import Inicio from './src/pages/Inicio/Inicio';
import Conferencia from './src/pages/Conferencia/Conferencia';
import BotaoVoltarCabecalho from './src/components/BotaoVoltarCabecalho/BotaoVoltarCabecalho';

const Stack = createNativeStackNavigator();

export default function App() {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
