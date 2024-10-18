import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";

export default function Conferencia({ navigation }) {
    const [cameraPermissao, setCameraPermissao] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [data, setData] = useState('');
    const [itensColetados, setItensColetados] = useState([]);
    const [modoExibirItens, setModoExibirItens] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissoes = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setCameraPermissao(status === 'granted');
        }

        getBarCodeScannerPermissoes();
    }, []);

    useEffect(() => {
        const adicionarVolumesEscaneados = () => {
            setItensColetados(prevData => {
                return [...prevData, data];
            });
        };

        adicionarVolumesEscaneados();
    }, [data]);


    const exibirItensColetados = () => {
        if (modoExibirItens == false) {
            setModoExibirItens(true)
        } else {
            setModoExibirItens(false)
        }
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setData(data);
        alert(` Dados: ${data}`);
    }

    if (cameraPermissao === null) {
        return <Text>Solicitando permissão para acessar a câmera...</Text>;
    }
    if (cameraPermissao === false) {
        return <Text>Sem acesso à câmera</Text>;
    }

    return (
        <View style={styles.containerConferencia}>
            <View style={styles.containerCameraConferencia}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.cameraConferencia}
                />
            </View>

            {scanned && (
                <Button title="Escanear novamente" onPress={() => setScanned(false)} />
            )}

            <Button
                title="Exibir itens coletados"
                onPress={exibirItensColetados}
            />

            {modoExibirItens && (
                <Text style={styles.dataText}>Dados escaneados: {itensColetados}</Text>
            )}


            <BarraFooter navigation={navigation}/>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'baseline'
    },
    dataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    containerConferencia: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerCameraConferencia: {
        flex: 0,
        width: '100%',
        height: '60%',
        paddingBottom: 20,
    },
    cameraConferencia: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }
});
