import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, TouchableWithoutFeedback, ScrollView, RefreshControl, Image } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { fetchPackingListPorId, fetchPackingListsQuantidade, insertPackingList } from "../../database/services/packingListService.js";
import { insertPackingListProduto } from "../../database/services/packingListProdutoService.js";
import { insertVolumesProdutos } from "../../database/services/volumeProdutoService.js";
import { insertVolume } from "../../database/services/volumeService.js";
import internetStatus from "../../components/VerificarConexaoComInternet/InternetStatus.js";
import { insertColeta } from "../../database/services/coletaService.js";
import { deviceName } from "expo-device";
import * as SecureStore from 'expo-secure-store';

export default function Inicio({ navigation }) {

    const [packinglistsExistentes, setPackinglistsExistentes] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const { height } = Dimensions.get('window');

    const idUsuario = SecureStore.getItem("id");

    useEffect(() => {
        const VerificarSeExisteImportada = async () => {
            const response = await fetchPackingListsQuantidade();
            if (response > 0) {
                navigation.replace("Importadas");
            } else {
                fetchPackinglistsInicio();
            }
        }

        VerificarSeExisteImportada();
    }, []);

    const fetchPackinglistsInicio = async () => {
        try {
            const statusInternet = await internetStatus();

            if (statusInternet) {
                const response = await api.get('/packinglist/mobile-listagem-packinglist-inicio');
                setPackinglistsExistentes(response.data);
            } else {
                Alert.alert(
                    'Atenção',
                    'Não há conexão com a internet. Não foi possível buscar os Packinglists.',
                    [
                        { text: 'OK', onPress: () => { }, style: 'cancel' },
                    ],
                );
            }

        } catch (error) {
            console.log("Erro ao carregar packinglists: ", error);
        }
    };

    const mostrarAlerta = (message, options) => {
        return new Promise((resolve) => {
            Alert.alert(
                "Está lista já possui coletas realizadas.",
                message,
                [
                    { text: 'Cancelar', onPress: () => { }, style: "cancel" },
                    { text: 'Iniciar nova', onPress: () => resolve('nova') },
                    { text: 'Continuar', onPress: () => resolve('continuar') },
                ]
            );
        });
    };

    const importar = async (idPackinglist, tipoDeImportacao) => {
        const statusInternet = internetStatus();
        const nomeTelefone = deviceName;

        try {
            if (statusInternet) {
                let response = [];

                const verificacaoSeExisteColeta = await api.get(`/coletas/verificar-existencia-coleta/${idPackinglist}/${idUsuario}`)
                console.log('idUsuario: ', idUsuario)
                if (verificacaoSeExisteColeta.data === true) {
                    const tipoDeImportacaoResposta = await mostrarAlerta(
                        "Você deseja iniciar uma nova coleta ou continuar da onde parou?"
                    );

                    tipoDeImportacao = tipoDeImportacaoResposta;

                } else {
                    response = await api.get(`/mobile-importacao/buscar-packinglist-inteira/${idPackinglist}`);
                }

                if (tipoDeImportacao === "nova") {
                    response = await api.get(`/mobile-importacao/buscar-packinglist-inteira/${idPackinglist}`);
                } else if (tipoDeImportacao === "continuar") {
                    response = await api.get(`/mobile-importacao/buscar-packinglist-inteira/continuar-importacao/${idPackinglist}/${idUsuario}/${nomeTelefone}`)
                }

                const packingList = response.data.packingListImportacaoMobile;
                    const packingListProdutoArray = response.data.packingListProdutoImportacaoMobile;
                    const volumeProdutoArray = response.data.volumeProdutoImportacaoMobile;
                    const volumeArray = response.data.volumeImportacaoMobile;
                    const coletaArray = response.data.coletaImportacaoMobile;

                const packingListImportar = {
                    idPackinglist: packingList.idPackinglist,
                    nomeImportador: packingList.nomeImportador,
                    pesoLiquidoTotal: packingList.pesoLiquidoTotal,
                    pesoBrutoTotal: packingList.pesoBrutoTotal,
                    numeroColetas: packingList.numeroColetas
                };

                await insertPackingList(packingListImportar);

                await Promise.all(
                    packingListProdutoArray.map(async (packingListProduto) => {
                        const packingListProdutoImportar = {
                            idPackinglist: packingListProduto.idPackinglist,
                            idProduto: packingListProduto.idProduto,
                            seq: packingListProduto.seq,
                            produto: packingListProduto.produto,
                            descricaoProduto: packingListProduto.descricaoProduto,
                            ordemProducao: packingListProduto.ordemProducao,
                            totalPesoLiquido: packingListProduto.totalPesoLiquido,
                            totalPesoBruto: packingListProduto.totalPesoBruto,
                            numeroSerie: packingListProduto.numeroSerie,
                        };
                        await insertPackingListProduto(packingListProdutoImportar);
                    })
                );

                await Promise.all(
                    volumeProdutoArray.map(async (volumeProduto) => {
                        const volumeProdutoImportar = {
                            idVolumeProduto: volumeProduto.idVolumeProduto,
                            idPackinglist: volumeProduto.idPackinglist,
                            idProduto: volumeProduto.idProduto,
                            seq: volumeProduto.seq,
                            idVolume: volumeProduto.idVolume,
                            qrCodeVolumeProduto: volumeProduto.qrCodeVolumeProduto,
                            seqVolume: volumeProduto.seqVolume,
                        };
                        await insertVolumesProdutos(volumeProdutoImportar);
                    })
                );

                await Promise.all(
                    volumeArray.map(async (volume) => {
                        const volumeImportar = {
                            idVolume: volume.idVolume,
                            idTipoVolumeId: volume.idTipoVolumeId,
                            quantidadeItens: volume.quantidadeItens,
                            descricao: volume.descricao,
                            pesoLiquido: volume.pesoLiquido,
                            pesoBruto: volume.pesoBruto,
                        };
                        await insertVolume(volumeImportar);
                    })
                );

                if (tipoDeImportacao === "continuar") {
                    await Promise.all(
                        coletaArray.map(async (coleta) => {
                            const coletaImportar = {
                                idColeta: coleta.idColeta,
                                idPackinglist: coleta.idPackinglist,
                                idProduto: coleta.idProduto,
                                seq: coleta.seq,
                                idVolume: coleta.idVolume,
                                idVolumeProduto: coleta.idVolumeProduto,
                                idUsuario: coleta.idUsuario,
                                nomeTelefone: coleta.nomeTelefone,
                                dataHoraColeta: coleta.dataHoraColeta,
                            };
                            await insertColeta(coletaImportar);
                        })
                    );
                }

                Alert.alert(
                    "Importação completa",
                    'Packinglist baixada com sucesso!',
                    [
                        { text: 'OK', onPress: () => { navigation.navigate("Importadas") }, style: 'cancel' },
                    ]
                );
                navigation.replace('Importadas');
            } else {
                Alert.alert(
                    'Atenção',
                    'Não há conexão com a internet. Não foi possível baixar a packinglist.',
                    [
                        { text: 'OK', onPress: () => { }, style: 'cancel' },
                    ]
                );
            }
        } catch (error) {
            console.log('Erro ao buscar PackingList: ', error);
        }
    };


    const handleImportarPackinglist = async (idPackinglist) => {
        const packinglist = await fetchPackingListPorId(idPackinglist);

        if (!packinglist) {
            importar(idPackinglist);
        } else {
            Alert.alert(
                'Importar Packinglist',
                'Esta packinglist já foi baixada, deseja atualizá-la?',
                [
                    { text: 'Sim', onPress: () => importar(idPackinglist) },
                    { text: 'Não', onPress: () => { }, style: 'cancel' },
                ],
                { cancelable: false }
            );
        }
    };

    const renderPackingListItem = ({ item, index }) => {
        const isLastItem = index === packinglistsExistentes.length - 1;

        return (
            <View style={style.containerRow}>
                <View style={style.containerListaPackinglist}>
                    <View style={[style.row, isLastItem && style.lastRow]}>
                        <View style={style.cell}>
                            <Text style={{ fontWeight: 'bold' }}>N° Lista: {item.idPackinglist}</Text>
                        </View>
                        <View style={style.cell}>
                            <Text style={{ fontWeight: 'bold' }}>Cliente: {item.nomeClienteImportador}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={{ padding: 10, backgroundColor: '#f1c694', borderRadius: 5, display: 'flex', alignItems: 'center' }}
                        onPress={() => { handleImportarPackinglist(item.idPackinglist) }}
                    >
                        <Text><Icon name="download" size={24} color="#000" />  Baixar</Text>
                    </TouchableOpacity>

                </View>
            </View>
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPackinglistsInicio();
        setRefreshing(false);
    };

    return (
        <View style={{ backgroundColor: '#e4ffee', flex: 1, justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', height: '80%' }}>
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: height / 2,
                        backgroundColor: '#1780e2',
                        borderBottomLeftRadius: 50,
                        borderBottomRightRadius: 50,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.4,
                        shadowRadius: 4,
                    }}
                />

                <FlatList
                    data={packinglistsExistentes}
                    keyExtractor={(item) => item.idPackinglist.toString()}
                    renderItem={renderPackingListItem}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#000']}
                        />
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ marginTop: 30, marginBottom: -100 }}
                />
            </View>

            <View style={{ display: 'flex' }}>
                <BarraFooter navigation={navigation} />
            </View>
        </View>
    );

}

const style = StyleSheet.create({
    containerRow: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        width: '100%',
    },
    containerListaPackinglist: {
        padding: 20,
        backgroundColor: '#edeccf',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '80%',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    containerLinhaRow: {
        display: 'flex',
        flexDirection: 'row'
    },
    row: {
        flexDirection: 'column',
        paddingVertical: 12,
        paddingHorizontal: 8,
        gap: 10,
        width: '60%',
    },
    lastRow: {

    },
    cell: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#333',
        fontSize: 14,
    },
  
});