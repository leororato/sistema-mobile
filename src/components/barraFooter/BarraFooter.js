import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchPackingListsQuantidade } from '../../database/services/packingListService';

export default function BarraFooter({ navigation }) {

    const navegacaoParaInicioOuImportacao = async () => {
        let rota;
        const response = await fetchPackingListsQuantidade();
        rota = response == true ? "Importadas" : "Inicio";
        navigation.replace(rota);        
    }

    const navegacaoParaColetaOuSemPl = async () => {
        let rota;
        const response = await fetchPackingListsQuantidade();
        rota = response == true ? "Coleta" : "ColetaSemPl";
        navigation.replace(rota);        
    }

    return (
        <View style={styles.containerBarraFooter}>
            <TouchableOpacity style={styles.viewIcone} onPress={navegacaoParaInicioOuImportacao}>
                <View>
                    <Icon name="home-outline" size={30} color="#000" />
                </View>
            </TouchableOpacity>

            <View style={styles.bordaCentral} />
            <TouchableOpacity onPress={navegacaoParaColetaOuSemPl} style={styles.viewIcone}>
                <View>
                    <Icon name="barcode-outline" size={30} color="#000" />
                </View>
            </TouchableOpacity>
        </View>
    );

    // return (
    //     <View style={styles.containerBarraFooter}>
    //         <View style={styles.viewIcone}>
    //             <TouchableOpacity onPress={navegacaoParaInicioOuImportacao}>
    //                 <Icon name="home-outline" size={30} color="#000" />
    //             </TouchableOpacity>
    //         </View>
    //         {/* Dividindo com borda no meio */}
    //         <View style={styles.bordaCentral} />
    //         <View style={styles.viewIcone}>
    //             <TouchableOpacity onPress={() => navigation.navigate('Coleta')}>
    //                 <Icon name="barcode-outline" size={30} color="#000" />
    //             </TouchableOpacity>
    //         </View>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    containerBarraFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#e4ffee',
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        alignItems: 'center',
    },
    viewIcone: {
        flex: 1, // Ocupa o mesmo espaço de ambos os lados
        alignItems: 'center',
    },
    bordaCentral: {
        height: '100%', // Altura total da barra
        width: 1, // Largura da borda
        backgroundColor: 'black',
    },
});
