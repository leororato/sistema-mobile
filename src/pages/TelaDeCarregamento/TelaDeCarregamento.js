import { useEffect } from "react";
import { Image, View } from "react-native";
import * as SecureStore from 'expo-secure-store';
import { fetchPackingListsQuantidade } from "../../database/services/packingListService";
import api from "../../../axiosConfig";

export default function TelaDeCarregamento({ navigation }) {
    const token = SecureStore.getItem('token');

    const VerificarSeExisteImportada = async () => {
        let rota;
        const quantidade = await fetchPackingListsQuantidade();
        console.log('quantidade: ', quantidade)
        rota = quantidade > 0 ? "Importadas" : "Inicio";
        navigation.replace(rota);
      }

    useEffect(() => {
        const verificarExpiracaoDoToken = async () => {
          console.log('token: ', token)
    
          if (token) {
            const response = await api.post("/usuario/validate-token", { token });
            if (response.data) {
              VerificarSeExisteImportada();
            } else {
                navigation.replace("Login")
            }
          } else {
            return;
          }
        }
    
        verificarExpiracaoDoToken();
      }, [])

    return (
        <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', backgroundColor: '#0EA6E8' }}>
                <Image source={require('../../../assets/engrenagem.png')}
                    style={{ width: 150, height: 150 }} />
        </View>
    )
}