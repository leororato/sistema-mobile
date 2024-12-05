import * as Device from 'expo-device';
import { Platform } from 'react-native';

const getDeviceInfo = () => {
  if (Platform.OS === 'ios') {
    return `UIDevice: ${Device.modelName || 'Desconhecido'}`;
  } else if (Platform.OS === 'android') {
    return `Android ID: ${Device.modelId || 'Desconhecido'}`;
  } else {
    return 'Sistema operacional desconhecido';
  }
};

const deviceInfo = getDeviceInfo();
