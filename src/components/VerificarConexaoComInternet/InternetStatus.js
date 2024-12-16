import axios from "axios"

const internetStatus = async () => {

  try {
    const response = await axios.get(`http://192.168.0.125:8080/api/teste-conexao/request`, { timeout: 1000 });
    console.log('teste internet: ', response.status)
    return true;
  } catch (error) {
    console.log('teste internet: ', error)
    return false;
  }

}

export default internetStatus;




// import NetInfo from '@react-native-community/netinfo';

// /**
//  * Função para verificar a conexão com a internet.
//  * @returns {Promise<boolean>} Retorna uma promessa que resolve com true se estiver conectado à internet, ou false caso contrário.
//  */
// const internetStatus = async () => {
//   const state = await NetInfo.fetch();
//   return state.isConnected;
// };

// export default internetStatus;
