import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useRoute } from "@react-navigation/native";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { format } from 'date-fns';

export default function Conferencia({ navigation }) {

    const [cameraPermissao, setCameraPermissao] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [data, setData] = useState('');
    const [itensColetados, setItensColetados] = useState([]);
    const [modoExibirItens, setModoExibirItens] = useState(false);
    const [packingListConferir, setPackingListConferir] = useState([]);

    const route = useRoute();
    const { idPackinglist } = route.params || {};

    const getBarCodeScannerPermissoes = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraPermissao(status === 'granted');
    }

    useEffect(() => {
        getBarCodeScannerPermissoes();
        fetchVolumesProdutos();
    }, []);

    useEffect(() => {
        const adicionarVolumesEscaneados = () => {
            setItensColetados(prevData => {
                return [...prevData, data];
            });
        };
        
        adicionarVolumesEscaneados();
    }, [data]);



    const fetchVolumesProdutos = async () => {

        try {
            const response = await api.get(`/volume-produto/volumes-produto-mobile/${idPackinglist}`);
            setPackingListConferir(response.data);

        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }


    const exibirItensColetados = () => {
        if (modoExibirItens == false) {
            setModoExibirItens(true)
        } else {
            setModoExibirItens(false)
        }
    }

    const handleBarCodeScanned = ({ data }) => {
        setScanned(true);
        setData(data);
    
        // Atualiza o array `itensColetados` diretamente
        setItensColetados((prevItens) => {
            if (!prevItens.includes(data)) { 
                return [...prevItens, data];
            }
            return prevItens;
        });
    
        console.log('Data escaneada: ', data);
        alert(`Dados: ${data}`);
    };

    const renderPackingListItem = ({ item, index }) => {
        const isLastItem = index === packingListConferir.length - 1;

        return (
            <TouchableOpacity onPressIn={(e) => handlePressIn(e, item)}>
                <View style={[styles.row, isLastItem && styles.lastRow]}>
                    <Text style={styles.cellWithBorder}>{item.idVolumeProduto}</Text>
                    <Text style={styles.cell}>{item.descricaoVolume}</Text>
                    <Text style={styles.cell}>Coletado</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.containerConferencia}>
            <View style={styles.containerCameraConferencia}>
                <Text>lugar da camera</Text>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.cameraConferencia}
                />
            </View>

            <TouchableWithoutFeedback>
                <View style={styles.containerToutchable}>
                    <View style={styles.containerBotaoRecarregar}>
                        <TouchableOpacity onPress={fetchVolumesProdutos}>
                            <Icon name="reload1" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.header}>
                            <Text style={styles.headerCell}>ID</Text>
                            <Text style={styles.headerCell}>Descrição</Text>
                            <Text style={styles.headerCell}>Status</Text>
                        </View>
                        <FlatList
                            data={packingListConferir}
                            renderItem={renderPackingListItem}
                            keyExtractor={item => item.idVolumeProduto}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>

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

            <BarraFooter navigation={navigation} />
        </View>
    );
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
        width: '40%',
        height: '20%',
        paddingBottom: 20,
    },
    cameraConferencia: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    row: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    cellWithBorder: {
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 5,
        borderRightWidth: 1,
        borderRightColor: '#ccc', // Cor da borda entre as colunas
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    table: {
        width: '90%',
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: '1px'
    },
    header: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ddd',
        padding: 10,
    },
    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    containerBotaoRecarregar: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 10,
    },
    containerToutchable: {
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    contextMenu: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
});
