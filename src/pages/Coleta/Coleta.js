import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useRoute } from "@react-navigation/native";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { format } from 'date-fns';
import { conferirSeJaFoiColetado, deletarTodasColetas, fetchColetas, fetchColetasListPorId, fetchColetasMaisRecentes, fetchColetasPorProduto, fetchItensColetados, insertColeta } from "../../database/services/coletaService";
import { fetchPackingListProdutoPorId } from "../../database/services/packingListProdutoService";
import { fetchQuantidadeVolumesProdutosDeUmProduto, fetchVolumesProdutosDeUmProduto } from "../../database/services/volumeProdutoService";

export default function Coleta({ navigation }) {



    const [cameraPermissao, setCameraPermissao] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [listaDeProdutosColetados, setListaDeProdutosColetados] = useState([]);

    const [packingListConferir, setPackingListConferir] = useState([]);
    const [itensColetados, setItensColetados] = useState([]);

    const route = useRoute();
    const { idPackinglist } = route.params || {};

    const getBarCodeScannerPermissoes = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraPermissao(status === 'granted');
    }

    useEffect(() => {
        getBarCodeScannerPermissoes();
        fetchColetados();
        console.log('lista: ', listaDeProdutosColetados)

    }, []);

    const fetchColetados = async () => {

        try {
            const response = await fetchColetasMaisRecentes();
            setItensColetados(response);
            console.log('coletados: ', response)
        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    const fetchDescricaoProduto = async (idPackinglist, idProduto, seq) => {
        try {
            const response = fetchPackingListProdutoPorId(idPackinglist, idProduto, seq);
            return response.descricaoProduto;
        } catch (error) {
            console.log('Erro ao buscar descrição do produto:', error.message);
        }
    }

    const fetchColetasDeUmProduto = async (idPackinglist, idProduto, seq) => {
        try {
            // Chama a função correta para buscar a quantidade de coletas
            const quantidadeColetada = await fetchColetasPorProduto(idPackinglist, idProduto, seq);
            const quantidadeTotalDeVolumes = await fetchQuantidadeVolumesProdutosDeUmProduto(idPackinglist, idProduto, seq);
    
            const quantidadesColeta = {
                quantidadeColetada: quantidadeColetada,
                quantidadeTotalDeVolumes: quantidadeTotalDeVolumes
            }
    
            return quantidadesColeta;
    
        } catch (error) {
            console.log('Erro ao buscar coletas do produto:', error.message);
        }
    }
    

    const adicionarNovoProdutoNaColeta = async ({ idPackinglist, idProduto, seq }) => {
        const response = await fetchPackingListProdutoPorId(idPackinglist, idProduto, seq);
        const quantidadesColeta = await fetchColetasDeUmProduto(idPackinglist, idProduto, seq);

        const produto = {
            idPackinglist: idPackinglist,
            idProduto: idProduto,
            seq: seq,
            descricaoProduto: response.descricaoProduto,
            quantidadeColetada: quantidadesColeta.quantidadeColetada,
            quantidadeTotalDeVolumes: quantidadesColeta.quantidadeTotalDeVolumes
        }

        setListaDeProdutosColetados(prevLista => [...prevLista, produto]);
        console.log('lista: ', listaDeProdutosColetados)
    }

    const atualizarQuantidadeColetada = (idPackinglist, idProduto, seq) => {
        setListaDeProdutosColetados(prevLista => {
            return prevLista.map(item => 
                item.idPackinglist === idPackinglist && 
                item.idProduto === idProduto && 
                item.seq === seq
                    ? { 
                        ...item, 
                        quantidadeColetada: item.quantidadeColetada + 1 
                    }
                    : item
            );
        });
    };
    

    const handleBarCodeScanned = async ({ data }) => {
        setScanned(true);

        try {

            const dadosQrCode = data.split('-');

            const idPackinglist = dadosQrCode[0];
            const idProduto = dadosQrCode[1];
            const seq = dadosQrCode[2];
            const idVolume = dadosQrCode[3];
            const idVolumeProduto = dadosQrCode[4];
            const dataHoraColeta = new Date();

            const verificarSeJaFoiColetado = await conferirSeJaFoiColetado(idPackinglist, idProduto, seq, idVolume, idVolumeProduto);
            if (verificarSeJaFoiColetado) {
                alert('Este item já foi coletado!');
                return;

            } else {

                const coleta_realizada = {
                    idPackinglist: idPackinglist,
                    idProduto: idProduto,
                    seq: seq,
                    idVolume: idVolume,
                    idVolumeProduto: idVolumeProduto,
                    dataHoraColeta: dataHoraColeta.toISOString().replace('T', ' ').slice(0, 19),
                }

                await insertColeta(coleta_realizada);
                await fetchColetados();
                
                if (!listaDeProdutosColetados.some(item => item.idPackinglist === idPackinglist && item.idProduto === idProduto && item.seq === seq)) {
                    adicionarNovoProdutoNaColeta({ idPackinglist, idProduto, seq });
                }
                
                await atualizarQuantidadeColetada(idPackinglist, idProduto, seq);

                console.log('dadosQrCode: ', dadosQrCode);
                console.log('coleta_realizada: ', coleta_realizada);
                alert(`Coletado: ${data}`);
            }
        } catch (error) {
            console.log('Erro ao coletar item:', error.message);

        }

    };

    const renderPackingListItem = ({ item, index }) => {
        const isLastItem = index === packingListConferir.length - 1;

        return (
            <TouchableOpacity>
                <View style={[styles.row, isLastItem && styles.lastRow]}>
                    <Text style={styles.cellWithBorder}>{item.idColeta}</Text>
                    <Text style={styles.cell}>{item.idPackinglist}</Text>
                    <Text style={styles.cell}>{item.dataHoraColeta}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.containerConferencia}>
            <View style={styles.containerCameraConferencia}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={styles.cameraConferencia}
                />
            </View>

            <View>
                <Text>
                    {listaDeProdutosColetados && (
                        listaDeProdutosColetados.map(item => {
                            return (
                                <TouchableOpacity key={item.idPackinglista}>
                                    <Text>{item.descricaoProduto}: [{item.quantidadeColetada}/{item.quantidadeTotalDeVolumes}]</Text>
                                </TouchableOpacity>
                            );
                        })
                    )}
                </Text>
            </View>

            <TouchableWithoutFeedback>
                <View style={styles.containerToutchable}>
                    <View style={styles.containerBotaoRecarregar}>
                        <Button 
                        title="Excluir tudo"
                        onPress={() => deletarTodasColetas() && fetchColetados() && setListaDeProdutosColetados([])}
                        />
                        <TouchableOpacity onPress={fetchColetados}>
                            <Icon name="reload1" size={30} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.header}>
                            <Text style={styles.headerCell}>ID Coleta</Text>
                            <Text style={styles.headerCell}>ID PL</Text>
                            <Text style={styles.headerCell}>DT/HR</Text>
                        </View>
                        <FlatList
                            data={itensColetados}
                            renderItem={renderPackingListItem}
                            keyExtractor={item => item.idColeta}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>

            {scanned && (
                <Button title="Escanear novamente" onPress={() => setScanned(false)} />
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
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    containerCameraConferencia: {
        flex: 0,
        width: '40%',
        height: '20%',
        paddingBottom: 20,
        marginTop: 10
    },
    cameraConferencia: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000'
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
        borderRightColor: '#ccc',
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
