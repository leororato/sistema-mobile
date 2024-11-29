import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchPackingLists, fetchPackingListsQuantidade } from '../../database/services/packingListService';

export default function BarraFooter({ navigation }) {

    const navegacaoParaInicioOuImportacao = async () => {
        const response = await fetchPackingListsQuantidade();
        if (response === 0) {
            navigation.navigate('Inicio');
        } else {
            navigation.navigate('Importadas');
        }
    }

    return (
        <View style={styles.containerBarraFooter}>
            <TouchableOpacity style={styles.viewIcone} onPress={navegacaoParaInicioOuImportacao}>
                <View>
                    <Icon name="home-outline" size={30} color="#000" />
                </View>
            </TouchableOpacity>

            <View style={styles.bordaCentral} />
            <TouchableOpacity onPress={() => navigation.navigate('Coleta')} style={styles.viewIcone}>
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
        elevation: 1,
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
