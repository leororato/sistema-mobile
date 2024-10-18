import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BarraFooter({ navigation }) {
    return (
        <View style={styles.containerBarraFooter}>
            <View style={styles.viewIcone}>
                <TouchableOpacity onPress={() => navigation.navigate('Inicio')}>
                    <Icon name="home-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>
            {/* Dividindo com borda no meio */}
            <View style={styles.bordaCentral} />
            <View style={styles.viewIcone}>
                <TouchableOpacity onPress={() => navigation.navigate('Conferência')}>
                    <Icon name="barcode-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerBarraFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#DEE7FE',
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
