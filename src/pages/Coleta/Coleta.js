import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Alert, Vibration, Keyboard, Animated } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/AntDesign'
import * as Animatable from 'react-native-animatable';;
import { conferirSeJaFoiColetado, deletarTodasColetas, fetchColetasMaisRecentes, fetchColetasPorProduto, fetchItensColetadosDeUmProduto, fetchNaoColetados, fetchNaoColetadosPorProduto, fetchProdutosQueTiveramColetas, insertColeta } from "../../database/services/coletaService";
import { fetchPackingListProdutos } from "../../database/services/packingListProdutoService";
import { fetchQuantidadeVolumesProdutosDeUmProduto } from "../../database/services/volumeProdutoService";
import { fetchDescricaoVolume } from "../../database/services/volumeService";
import { fetchPackingListPorId, fetchPackingLists } from "../../database/services/packingListService";

export default function Coleta({ navigation }) {

    const cores = ['#6DCFE3', '#87E090', '#B2E03D', '#5B91E8', '#0EA6E8'];

    const [cameraPermissao, setCameraPermissao] = useState(null);
    const [scanned, setScanned] = useState(false);

    const [listaProdutos, setListaProdutos] = useState([]);

    const [selecionado, setSelecionado] = useState("coletados");
    const animacao = useRef(new Animated.Value(0)).current;

    const [itensColetados, setItensColetados] = useState([]);
    const [itensNaoColetados, setItensNaoColetados] = useState([]);

    const [produtoSelecionado, setProdutoSelecionado] = useState({ idPackinglist: null, idProduto: null, seq: null })
    const [verificacaSeProdutoSelecionado, setVerificacaoSeProdutoSelecionado] = useState(false);

    const route = useRoute();
    const { idPackinglist } = route.params || {};

    // permissao utilizar para a camera
    const getBarCodeScannerPermissoes = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraPermissao(status === 'granted');
    }

    // roda a permissao e chama funçao para exibir os produtos que foram importados, aparecendo no topo da tela
    useEffect(() => {
        getBarCodeScannerPermissoes();

        fetchColetados();
        fetchListaProdutos();
    }, []);

    // funçao que procura e retorna todas as coletas de um produto, ordenando pela dataHoraColeta
    const fetchColetados = async () => {
        setItensNaoColetados([]);
        try {

            if (!verificacaSeProdutoSelecionado) {
                const response = await fetchColetasMaisRecentes();
                setItensColetados(response);

            } else {

                const response = await fetchItensColetadosDeUmProduto(produtoSelecionado.idPackinglist, produtoSelecionado.idProduto, produtoSelecionado.seq);
                setItensColetados(response);
            }

        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    const fetchColetadosDoProdutoQueFoiColetado = async (idPackinglistColetado, idProdutoColetado, seqColetado) => {
        setItensNaoColetados([]);

        try {
            let idPackinglist;
            let idProduto;
            let seq;
            if (idPackinglistColetado === produtoSelecionado.idPackinglist && idProdutoColetado === produtoSelecionado.idProduto && seqColetado === produtoSelecionado.seq) {
                idPackinglist = produtoSelecionado.idPackinglist;
                idProduto = produtoSelecionado.idProduto;
                seq = produtoSelecionado.seq;
            } else {
                idPackinglist = idPackinglistColetado;
                idProduto = idProdutoColetado;
                seq = seqColetado;
            }

            const response = await fetchItensColetadosDeUmProduto(idPackinglist, idProduto, seq);
            setItensColetados(response);

        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    const fetchNaoColetadosDoProdutoQueFoiColetado = async (idPackinglistColetado, idProdutoColetado, seqColetado) => {
        setItensNaoColetados([]);

        try {
            let idPackinglist;
            let idProduto;
            let seq;
            if (idPackinglistColetado === produtoSelecionado.idPackinglist && idProdutoColetado === produtoSelecionado.idProduto && seqColetado === produtoSelecionado.seq) {
                idPackinglist = produtoSelecionado.idPackinglist;
                idProduto = produtoSelecionado.idProduto;
                seq = produtoSelecionado.seq;
            } else {
                idPackinglist = idPackinglistColetado;
                idProduto = idProdutoColetado;
                seq = seqColetado;
            }

            const response = await fetchNaoColetadosPorProduto(idPackinglist, idProduto, seq);
            setItensNaoColetados(response);

        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    // funçao que exibe os volumes que nao foram coletados
    const fetchVolumesNaoColetados = async () => {
        try {
            setItensColetados([]);
            if (!verificacaSeProdutoSelecionado) {
                const response = await fetchNaoColetados();
                if (response.length === 0) {
                    setItensNaoColetados([{ descricao: "Todos os volumes já foram coletados." }])
                } else {
                    setItensNaoColetados(response);
                }

            } else {
                const response = await fetchNaoColetadosPorProduto(produtoSelecionado.idPackinglist, produtoSelecionado.idProduto, produtoSelecionado.seq);
                if (response.length === 0) {
                    setItensNaoColetados([{ descricao: "Todos os volumes do produto já foram coletados." }])
                } else {
                    setItensNaoColetados(response);
                }
                console.log('nao coletados de um produto')
            }


        } catch (error) {
            console.log('Erro ao buscar packinglist:', error.message);
        }
    }

    // busca e retorna a quantidade de coleta em numeros, por produto
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

    // funçao para quando clicar em cima de algum produto para ver seus itens coletados
    const buscarListaDeColetadosOuNaoColetadosDeUmProduto = async (idPackinglist, idProduto, seq) => {
        if (selecionado === "coletados") {
            const response = await fetchItensColetadosDeUmProduto(idPackinglist, idProduto, seq);
            if (response.length === 0) {
                setItensColetados([{ descricao: "Nenhum volume foi coletado." }])
            } else {
                setItensColetados(response);
            }

        } else if (selecionado === "naoColetados") {
            const response = await fetchNaoColetadosPorProduto(idPackinglist, idProduto, seq);
            if (response.length === 0) {
                setItensNaoColetados([{ descricao: "Todos os volumes já foram coletados." }])
            } else {
                setItensNaoColetados(response);
            }
        }
    }

    // funçao que buscam os produtos que houveram coletas para exibir no topo da tela
    const fetchListaProdutos = async () => {
        const response = await fetchPackingListProdutos();
        const produtos = Array.isArray(response) ? response : [response];

        const listaDeProdutos = [];

        for (const [index, produto] of produtos.entries()) {
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
                borderColor: cores[index % cores.length],
            };

            listaDeProdutos.push(novoProduto);
        }

        setListaProdutos(listaDeProdutos);
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

            const conferirSeAPackinglistEstaNoBanco = await fetchPackingListPorId(idPackinglist);
            const conferirSeExisteAlgumaPackinglistImportada = await fetchPackingLists();

            if (conferirSeExisteAlgumaPackinglistImportada.length == 0) {
                Alert.alert(
                    'Atenção',
                    'Nenhuma Packinglist foi importada ainda...',
                    [
                        { text: 'Ir para Importação', onPress: () => navigation.navigate("Inicio") },
                        { text: 'Cancelar', onPress: () => { }, style: 'cancel' },
                    ],
                    { cancelable: false }
                );

            } else if (!conferirSeAPackinglistEstaNoBanco) {
                Alert.alert(
                    "Atenção",
                    "Este volume não foi encontrado na Packinglist",
                    [{ text: "OK" }]
                );

                return;
            } else {


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
                    await fetchListaProdutos();
                    await vibracao1();

                    if (selecionado === "coletados") {
                        await fetchColetadosDoProdutoQueFoiColetado(idPackinglist, idProduto, seq);
                    } else if (selecionado === "naoColetados") {
                        await fetchNaoColetadosDoProdutoQueFoiColetado(idPackinglist, idProduto, seq);
                    }

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

    const renderVolumes = ({ item }) => {

        // encontrando o produto correspondente ao volume
        const produto = listaProdutos.find(prod => prod.idProduto === item.idProduto);

        return (
            <TouchableOpacity>
                <View
                    style={[
                        styles.row,
                        { backgroundColor: produto ? produto.borderColor : 'transparent' }
                    ]}
                >
                    <Text style={styles.cellWithBorder}>{item.seqVolume}</Text>
                    <Text style={styles.cell}>{item.descricao}</Text>
                    <Text style={styles.cell}>{item.dataHoraColeta}</Text>

                </View>
            </TouchableOpacity>
        );
    };




    const handleReloadListas = () => {
        setSelecionado("coletados");
        setItensNaoColetados([]);
        setProdutoSelecionado({ idPackinglist: null, idProduto: null, seq: null });
        setVerificacaoSeProdutoSelecionado(false)
    };

    const moverBarra = (posicao) => {
        Animated.timing(animacao, {
            toValue: posicao,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };

    useEffect(() => {
        if (selecionado === 'coletados') {
            moverBarra(0);
        } else {
            moverBarra(1);
        }
    }, [selecionado]);

    // Interpolação da posição da barra
    const posicaoBarra = animacao.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '50%'],
    });


    return (

        <View style={{ flex: 1, backgroundColor: '#e4ffee', }}>
            <View style={styles.containerConferencia}>
                <View style={styles.containerCameraConferencia}>
                    <View style={{ flex: 0, width: '100%', height: '100%' }}>
                        <BarCodeScanner
                            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                            style={styles.cameraConferencia}
                        >
                            <Animatable.View
                                animation="slideInDown"
                                iterationCount="infinite"
                                direction="alternate"
                                style={styles.scanLine}
                            />
                        </BarCodeScanner>

                    </View>
                </View>

                <View style={{ width: '90%' }}>
                    <Text>
                        {listaProdutos.map((item, index) => (
                            <TouchableOpacity
                                key={`${item.idPackinglist}-${item.idProduto}-${item.seq}-${index}`}
                                style={[
                                    styles.produtoColetado,
                                    {
                                        marginBottom: 10,
                                        borderColor: item.borderColor,
                                        backgroundColor:
                                            produtoSelecionado?.idPackinglist === item.idPackinglist &&
                                                produtoSelecionado?.idProduto === item.idProduto &&
                                                produtoSelecionado?.seq === item.seq
                                                ? item.borderColor
                                                : 'white',
                                    },
                                ]}
                                onPress={() => {
                                    buscarListaDeColetadosOuNaoColetadosDeUmProduto(
                                        item.idPackinglist,
                                        item.idProduto,
                                        item.seq
                                    );
                                    setProdutoSelecionado({
                                        idPackinglist: item.idPackinglist,
                                        idProduto: item.idProduto,
                                        seq: item.seq,
                                    });
                                    setVerificacaoSeProdutoSelecionado(true);
                                }}
                            >
                                <Text style={{
                                    marginTop: '5px',
                                    fontWeight:
                                        produtoSelecionado?.idPackinglist === item.idPackinglist &&
                                            produtoSelecionado?.idProduto === item.idProduto &&
                                            produtoSelecionado?.seq === item.seq
                                            ? 'bold'
                                            : 'normal',
                                }}>
                                    {item.ordemProducao} / {item.descricaoProduto}: [{item.quantidadeColetada}/
                                    {item.quantidadeTotalDeVolumes}]
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </Text>
                </View>

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                    <View style={styles.containerToutchable}>
                        <View style={styles.containerBotaoRecarregar}>
                            <View style={selecionado === 'coletados' || selecionado === 'naoColetados' ? styles.botoesContainer : styles.botoesContainerNenhumSelecionado}>
                                <Animated.View
                                    style={[
                                        styles.barraFundo,
                                        { left: posicaoBarra },
                                    ]}
                                />

                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={() => {
                                        setSelecionado('coletados');
                                        fetchColetados();
                                    }}
                                >
                                    <Text style={styles.textoBotao}>Coletados</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.botao}
                                    onPress={() => {
                                        setSelecionado('naoColetados');
                                        fetchVolumesNaoColetados();
                                    }}
                                >
                                    <Text style={styles.textoBotao}>Não coletados</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity onPress={() => deletarTodasColetas() && fetchColetados() && fetchListaProdutos()}><Text>reset</Text></TouchableOpacity>
                            <TouchableOpacity onPress={handleReloadListas}>
                                <Icon name="reload1" size={30} color="#000" />
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
                                keyExtractor={(item, index) => `${item.idColeta}-${index}`}
                                contentContainerStyle={{ paddingBottom: 60 }}
                            />
                        </View>

                    </View>
                </TouchableWithoutFeedback>


                <BarraFooter navigation={navigation} />
            </View>
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
        marginTop: 50
    },
    containerCameraConferencia: {
        flex: 0,
        width: '40%',
        height: '20%',
        marginBottom: 20
    },
    // cameraConferencia: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     width: '100%',
    //     height: '100%',
    // },
    cameraConferencia: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 50,
        left: 50,
        right: 50,
        bottom: 50,
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    overlayText: {
        color: 'white',
        fontSize: 18,
    },
    scanLine: {
        position: 'absolute',
        top: '80%',
        left: 3,
        right: 3,
        height: 3,
        backgroundColor: '#9abeb0',
        zIndex: 2,
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
        flex: 1,
        width: '100%',
        paddingHorizontal: 10,
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
    containerToutchable: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        width: '100%'
    },
    containerBotaoRecarregar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    botoesContainer: {
        flexDirection: 'row',
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#9CD591',
        width: '70%',
    },
    botoesContainerNenhumSelecionado: {
        flexDirection: 'row',
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#9CD591',
        width: '70%',
    },
    botoes: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'lightgray',
    },
    textoBotao: {
        color: 'white',
        fontWeight: 'bold',
    },
    produtoColetado: {
        borderWidth: 2,
        borderColor: 'red',
        borderRadius: 5,
        width: '100%',
        padding: 5
    },
    textoProdutoColetado: {
        padding: 5,
    },
    barraFundo: {
        position: 'absolute',
        width: '50%', // Metade da largura do contêiner
        height: '100%',
        backgroundColor: '#66AA58',
        borderRadius: 25,
    },
    botao: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
        alignItems: 'center',
    },

});
