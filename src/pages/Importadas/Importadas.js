import { FlatList, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback, Button, Alert, RefreshControl, Image, Dimensions } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import { format } from 'date-fns';
import { deletarPackinglistPorId, deletarTodasPackinglistsImportadas, fetchPackingLists, fetchPackingListsQuantidade, insertPackingList } from "../../database/services/packingListService.js";
import { deletarPackinglistProdutoPorIdPackinglist, deletarTodasPackinglistProdutosImportadas, fetchPackingListProdutos, insertPackingListProduto } from "../../database/services/packingListProdutoService.js";
import { deletarTodosVolumesProdutosImportados, deletarVolumeProdutoPorIdPackinglist, fetchVolumesProdutos, insertVolumesProdutos } from "../../database/services/volumeProdutoService.js";
import { deletarTodosVolumesImportados, deletarVolumesPorIdPackinglist, fetchVolumes, insertVolume } from "../../database/services/volumeService.js";
import { deletarTodasColetas, fetchColetas, fetchColetasParaExportacao, insertColeta } from "../../database/services/coletaService.js";
import api from "../../../axiosConfig.js";
import internetStatus from "../../components/VerificarConexaoComInternet/InternetStatus.js";
import { deletarTodosItensDeletados, fetchTodasColetasDeletadas } from "../../database/services/itensDeletarService.js";

export default function Importadas({ navigation }) {

    const [packinglistsExistentes, setPackinglistsExistentes] = useState([]);

    const [refreshing, setRefreshing] = useState(false);
    const { height } = Dimensions.get('window');



    useEffect(() => {
        buscarPackinglistsImportadas();
    }, [])

    const buscarPackinglistsImportadas = async () => {
        const packinglist = await fetchPackingLists();
        await setPackinglistsExistentes(packinglist);

    }

    const handleExportarColetas = () => {
        Alert.alert(
            "Deseja enviar a lista?",
            '',
            [
                {
                    text: 'Ok', onPress: () => exportarColetas()
                },
                {
                    text: 'Cancelar', onPress: () => { }, style: 'cancel'
                },
            ]
        );
    };

    const handleImportarNovamente = async (idPackinglist) => {
        Alert.alert(
            'Atualizar Lista',
            `Deseja baixar a lista novamente?`,
            [
                {
                    text: 'Sim', onPress: () => Alert.alert(
                        
                        'Verifique as coletas.',
                        'A lista selecionada para exclusão possui coletas que não foram enviadas para o servidor, deseja mesmo exclui-la?',
                        [
                            {
                                text: 'Sim', onPress: () => deletarItensPackinglist(idPackinglist)
                            }, 
                            { text: 'Cancelar', onPress: () => { }, style: 'cancel'},
                        ]
                    )
                },
                { text: 'Não', onPress: () => { }, style: 'cancel' },
            ],
            { cancelable: false }
        );
    }

    const exportarColetas = async () => {
        try {

            const statusInternet = await internetStatus();
            if (statusInternet) {
                const coletasRealizadas = await fetchColetasParaExportacao();
                const coletasDeletadas = await fetchTodasColetasDeletadas();

                const coletaExportacaoRequest = {
                    "coletaDTO": coletasRealizadas,
                    "coletaDeletadasDTO": coletasDeletadas
                };

                await api.post("/coletas/exportar-coleta", coletaExportacaoRequest);
                await deletarTodosItensDeletados();
                Alert.alert(
                    "Packinglist enviada com sucesso.",
                    '',
                    [{
                        text: 'Ok', onPress: () => { }
                    }]
                );
            } else {
                Alert.alert(
                    'Atenção',
                    'Não há conexão com a internet. Não foi possível enviar as coletas da lista.',
                    [
                        { text: 'OK', onPress: () => { }, style: 'cancel' },
                    ],
                );
            }

        } catch (error) {
            if (error.response && error.response.data) {
                Alert.alert('Erro', error.response.data.message || 'Erro desconhecido ao exportar coletas.');
            } else {
                Alert.alert('Erro', 'Erro de conexão ou servidor inacessível.');
            }
        }
    };


    const handleExcluirPlImportada = async (idPackinglist) => {

        Alert.alert(
            'Excluir Lista',
            `Tem certeza que deseja excluir a Lista ${idPackinglist}?`,
            [
                {
                    text: 'Sim', onPress: () => Alert.alert(
                        'A Lista possui coletas pendentes.',
                        'A lista selecionada para exclusão possui coletas que não foram enviadas para o servidor, deseja mesmo exclui-la?',
                        [
                            {
                                text: 'Sim', onPress: () => deletarItensPackinglist(idPackinglist)
                            }, 
                            { text: 'Cancelar', onPress: () => { }, style: 'cancel'},
                        ]
                    )
                },
                { text: 'Não', onPress: () => { }, style: 'cancel' },
            ],
            { cancelable: false }
        );
    }

    const deletarItensPackinglist = async (idPackinglist) => {

        await deletarVolumesPorIdPackinglist(idPackinglist);
        await deletarVolumeProdutoPorIdPackinglist(idPackinglist);
        await deletarPackinglistProdutoPorIdPackinglist(idPackinglist);
        await deletarPackinglistPorId(idPackinglist);
        await deletarTodasColetas();
        await deletarTodosItensDeletados();

        await buscarPackinglistsImportadas();

        Alert.alert('Packinglist removida.');

        navigation.replace("Inicio");
    }

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
                            <Text style={{ fontWeight: 'bold' }}>Cliente: {item.nomeImportador}</Text>
                        </View>
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'column', gap: 5, maxWidth: 150 }}>
                        <TouchableOpacity style={{ padding: 10, backgroundColor: '#f1c694', borderRadius: 5, display: 'flex', alignItems: 'center' }}
                            onPress={() => { handleExportarColetas() }}
                        >
                            <Text><Icon name="export" size={20} color="#000" />  Salvar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, backgroundColor: '#f1c694', borderRadius: 5, display: 'flex', alignItems: 'center',  flexWrap: 'nowrap'}}
                            onPress={() => { handleImportarNovamente(item.idPackinglist) }}
                        >
                            <Text><Icon name="download" size={20} color="#000" />  Baixar novamente</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ padding: 10, backgroundColor: '#f1c694', borderRadius: 5, display: 'flex', alignItems: 'center' }}
                            onPress={() => { handleExcluirPlImportada(item.idPackinglist) }}
                        >
                            <Text><Icon name="delete" size={20} color="#000" />  Excluir</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await buscarPackinglistsImportadas();
        setRefreshing(false);
    };



    return (
        <View style={{ flex: 1, backgroundColor: '#e4ffee' }}>
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
                style={{ marginTop: 100 }}
            />

            <BarraFooter navigation={navigation} />
        </View>
    );

}

const style = StyleSheet.create({
    containerRow: {
        display: 'flex',
        alignItems: 'center',
        marginTop: 50,
        width: '100%'
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
        elevation: 8
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


