import * as Device from 'expo-device';
import { Platform } from 'react-native';

const getDeviceInfo = () => {
  if (Platform.OS === 'ios') {
    console.log('Dispositivo iOS');
    return `UIDevice: ${Device.modelName || 'Desconhecido'}`; // Simulação para iOS
  } else if (Platform.OS === 'android') {
    console.log('Dispositivo Android');
    return `Android ID: ${Device.modelId || 'Desconhecido'}`; // Simulação para Android
  } else {
    return 'Sistema operacional desconhecido';
  }
};

const deviceInfo = getDeviceInfo();
console.log(deviceInfo);
