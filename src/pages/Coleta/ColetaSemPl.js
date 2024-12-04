import { useEffect, useRef } from "react";
import { Text } from "react-native";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign'
import BarraFooter from "../../components/barraFooter/BarraFooter";


function ColetaSemPl({ navigation }) {

    const scaleValue = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleValue, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true, 
                }),
                Animated.timing(scaleValue, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleValue]);

    return (
        <View style={{ backgroundColor: "#e4ffee", flex: 1 }}>
            <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <View style={{ width: '80%', }}>
                    <Icon name="closecircle" size={100} color={'#7a8370'} style={{ textAlign: 'center', marginBottom: 20 }} />
                    <Text style={{ fontSize: 20, textAlign: 'center', color: '#7a8370' }}>Importe uma packinglist para iniciar sua coleta...</Text>
                </View>
                <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <TouchableOpacity style={styles.containerBotaoImportar} onPress={() => { navigation.replace("Inicio") }}>
                        <Icon name="download" size={50} style={{ justifyContent: 'center', color: '#f0f0d8' }} />
                        <Text style={{ fontSize: 20, textAlign: 'center', justifyContent: 'center', color: '#f0f0d8', fontWeight: '700' }}>IMPORTAR</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <BarraFooter navigation={navigation} />
        </View>)
}

export default ColetaSemPl;


const styles = StyleSheet.create({

    containerBotaoImportar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        backgroundColor: '#2196F3',
        padding: 10,
        gap: 10,
        borderRadius: 8
    },

})