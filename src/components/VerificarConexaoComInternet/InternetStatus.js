import NetInfo from '@react-native-community/netinfo';

/**
 * Função para verificar a conexão com a internet.
 * @returns {Promise<boolean>} Retorna uma promessa que resolve com true se estiver conectado à internet, ou false caso contrário.
 */
const internetStatus = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected;
};

export default internetStatus;
