import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const BotaoVoltarCabecalho = ({ navigation }) => {
    return (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10, backgroundColor: '#ccc', padding: 5, borderRadius: 4 }}>
            <Text style={{ color: '#000', fontSize: 20 }}>Voltar</Text>
        </TouchableOpacity>
    );
};

export default BotaoVoltarCabecalho;
