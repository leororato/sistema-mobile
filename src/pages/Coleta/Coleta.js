import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Alert, Vibration } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useRoute } from "@react-navigation/native";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { format } from 'date-fns';
import { conferirSeJaFoiColetado, deletarTodasColetas, fetchColetasMaisRecentes, fetchColetasPorProduto, fetchItensColetadosDeUmProduto, fetchNaoColetados, fetchProdutosQueTiveramColetas, insertColeta } from "../../database/services/coletaService";
import { fetchPackingListProdutoPorId } from "../../database/services/packingListProdutoService";
import { fetchQuantidadeVolumesProdutosDeUmProduto } from "../../database/services/volumeProdutoService";
import { fetchDescricaoVolume } from "../../database/services/volumeService";

export default function Coleta({ navigation }) {



    const [cameraPermissao, setCameraPermissao] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [listaDeProdutosColetados, setListaDeProdutosColetados] = useState([]);
    const [listaIncialDeProdutosColetados, setListaInicialDeProdutosColetados] = useState([]);

    const [modoExibicaoDosItens, setModoExibicaoDosItens] = useState("Coletados");

    const [packingListConferir, setPackingListConferir] = useState([]);
    const [itensColetados, setItensColetados] = useState([]);
    const [itensNaoColetados, setItensNaoColetados] = useState([]);

    const route = useRoute();
    const { idPackinglist } = route.params || {};


    const getBarCodeScannerPermissoes = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraPermissao(status === 'granted');
    }

    useEffect(() => {
        getBarCodeScannerPermissoes();
        fetchColetados();

        pesquisarProdutosEVolumesColetados();

    }, []);

    const fetchColetados = async () => {

        try {
            const response = await fetchColetasMaisRecentes();
            setItensColetados(response);

        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    useEffect(() => {
        if (modoExibicaoDosItens === "NaoColetados") {
            fetchVolumesNaoColetados();
        }
    }, [modoExibicaoDosItens])

    const fetchVolumesNaoColetados = async () => {
        setModoExibicaoDosItens("NaoColetados")
        try {
            const response = await fetchNaoColetados();
            setItensNaoColetados(response);
            setItensColetados([]);

            console.log('não coletados: ', response);
        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    const fetchColetasDeUmProduto = async (idPackinglist, idProduto, seq) => {
        try {

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

    const pesquisarProdutosEVolumesColetados = async () => {
        const response = await fetchProdutosQueTiveramColetas();
        const produtos = Array.isArray(response) ? response : [response];
        
        const listaDeProdutos = [];
        
        for (const produto of produtos) {
            const quantidadesColeta = await fetchColetasDeUmProduto(
                produto.idPackinglist,
                produto.idProduto,
                produto.seq
            );
            
            const ordemProducao = produto.ordemProducao ? produto.ordemProducao : "Sem ordem";

            const novoProduto = {
                idPackinglist: produto.idPackinglist,
                idProduto: produto.idProduto,
                seq: produto.seq,
                descricaoProduto: produto.descricaoProduto,
                ordemProducao: ordemProducao,
                quantidadeColetada: quantidadesColeta.quantidadeColetada,
                quantidadeTotalDeVolumes: quantidadesColeta.quantidadeTotalDeVolumes,
            };
    
            listaDeProdutos.push(novoProduto);
        }
    
        setListaInicialDeProdutosColetados(listaDeProdutos);
    };
    

    const adicionarNovoProdutoNaColeta = async ({ idPackinglist, idProduto, seq }) => {
        const response = await fetchPackingListProdutoPorId(idPackinglist, idProduto, seq);
        const quantidadesColeta = await fetchColetasDeUmProduto(idPackinglist, idProduto, seq);
        const ordemProducao = response.ordemProducao ? response.ordemProducao : "Sem ordem";

        const produto = {
            idPackinglist: idPackinglist,
            idProduto: idProduto,
            seq: seq,
            descricaoProduto: response.descricaoProduto,
            ordemProducao: ordemProducao,
            quantidadeColetada: quantidadesColeta.quantidadeColetada,
            quantidadeTotalDeVolumes: quantidadesColeta.quantidadeTotalDeVolumes
        }

        setListaDeProdutosColetados(prevLista => [...prevLista, produto]);
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

    const vibracao1 = () => {
        Vibration.vibrate(500);
    }

    const vibracao2 = () => {
        Vibration.vibrate([300, 300, 300]);
    }

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

                vibracao2();
                Alert.alert(
                    "Atenção",
                    "Este Volume já foi coletado!",
                    [{ text: "OK" }]
                );

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
                await vibracao1();

                if (!listaDeProdutosColetados.some(item => item.idPackinglist === idPackinglist && item.idProduto === idProduto && item.seq === seq)) {
                    adicionarNovoProdutoNaColeta({ idPackinglist, idProduto, seq });
                }

                await atualizarQuantidadeColetada(idPackinglist, idProduto, seq);

                const response = await fetchDescricaoVolume(idVolume);

                const descricaoVolume = response[0]?.descricao;

                if (descricaoVolume) {
                    Alert.alert(
                        "Produto Coletado",
                        `Descrição: ${descricaoVolume}`,
                        [{ text: "OK" }]);
                } else {
                    Alert.alert(
                        "Produto Coletado",
                        "A descrição não foi encontrada",
                        [{ text: "OK" }]
                    );
                }
            }

        } catch (error) {
            console.log('Erro ao coletar item:', error.message);

        }

    };

    useEffect(() => {
        if (scanned) {
            setTimeout(() => {
                setScanned(false);
            }, 3000)
        }
    }, [scanned])

    const renderVolumes = ({ item, index }) => {
        const isLastItem = index === packingListConferir.length - 1;

        return (
            <TouchableOpacity>
                <View style={[styles.row, isLastItem && styles.lastRow]}>
                    <Text style={styles.cellWithBorder}>{item.seq}</Text>
                    <Text style={styles.cell}>{item.descricao}</Text>
                    <Text style={styles.cell}>{item.dataHoraColeta}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const buscarListaDeColetadosDeUmProduto = async (idPackinglist, idProduto, seq) => {
        const response = await fetchItensColetadosDeUmProduto(idPackinglist, idProduto, seq);

        setItensColetados(response);
    }

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
                    {listaDeProdutosColetados && listaDeProdutosColetados.length > 0 ? (
                        listaDeProdutosColetados.map((item, index) => (
                            <TouchableOpacity style={[styles.produtoColetado, {marginBottom: 10}]} key={`${item.idPackinglist}-${item.idProduto}-${item.seq}-${index}`}>
                                <Text style={{marginTop: '5px'}}>
                                    {item.ordemProducao} / {item.descricaoProduto}: [{item.quantidadeColetada}/{item.quantidadeTotalDeVolumes}]
                                </Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        listaIncialDeProdutosColetados.map((item, index) => (
                            <TouchableOpacity style={[styles.produtoColetado, {marginBottom: 10}]} key={`${item.idPackinglist}-${item.idProduto}-${item.seq}-${index}`} onPress={() => buscarListaDeColetadosDeUmProduto(item.idPackinglist, item.idProduto, item.seq)}>
                                <Text style={styles.textoProdutoColetado}>
                                {item.ordemProducao} / {item.descricaoProduto}:  [{item.quantidadeColetada}/{item.quantidadeTotalDeVolumes}]
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                </Text>
            </View>


            <TouchableWithoutFeedback>
                <View style={styles.containerToutchable}>
                    <View style={styles.containerBotaoRecarregar}>
                        <Button
                            title="Excluir tudo"
                            onPress={() => deletarTodasColetas() && fetchColetados() && setListaDeProdutosColetados([]) && setListaInicialDeProdutosColetados([])}
                        />
                        <TouchableOpacity onPress={fetchColetados}>
                            <Icon name="reload1" size={30} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Button title="Não coletados" onPress={fetchVolumesNaoColetados} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.table}>
                        <View style={styles.header}>
                            <Text style={styles.headerCell}>Seq</Text>
                            <Text style={styles.headerCell}>Descrição</Text>
                            <Text style={styles.headerCell}>DT/HR</Text>
                        </View>
                        <FlatList
                            data={itensColetados.length > 0 ? itensColetados : itensNaoColetados}
                            renderItem={renderVolumes}
                            keyExtractor={item => item.idColeta}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>



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
        display: 'flex',
        flexDirection: 'row',
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
    produtoColetado: {
        borderWidth: 1,
        borderColor: 'red',
        width: '100%'
    },
    textoProdutoColetado: {
        padding: 5,
    },
});
