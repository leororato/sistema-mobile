import { Button, StyleSheet, Text, View } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";


export default function Inicio({ navigation }) {
    return (
        <View style={style.containerInicio}>
            <View>
                <Button
                    title="Conferir Máquina"
                    onPress={() => navigation.navigate('Conferência')}
                />
            </View>
            
            <BarraFooter navigation={navigation} />
        </View>
    )
};

const style = StyleSheet.create({
    containerInicio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        width: '100%',
        height: '100%'
    }
})