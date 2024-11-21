import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, TouchableWithoutFeedback } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { fetchPackingListPorId, fetchPackingLists, insertPackingList } from "../../database/services/packingListService.js";
import { excluirDatabase } from "../../database/database.js";
import { insertPackingListProduto } from "../../database/services/packingListProdutoService.js";
import { insertVolumesProdutos } from "../../database/services/volumeProdutoService.js";
import { insertVolume } from "../../database/services/volumeService.js";

export default function Inicio({ navigation }) {

    const [packinglistsExistentes, setPackinglistsExistentes] = useState([]);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedItem, setSelectedItem] = useState(null);



    useEffect(() => {
        fetchPackinglistsInicio();
    }, []);

    const fetchPackinglistsInicio = async () => {
        try {
            const response = await api.get('/packinglist/mobile-listagem-packinglist-inicio');
            setPackinglistsExistentes(response.data);

        } catch (error) {
            console.log("Erro ao carregar packinglists: ", error);
        }
    };

    const handlePressIn = (e, item) => {
        const { pageX, pageY } = e.nativeEvent;

        let adjustedX = pageX + 0;
        let adjustedY = pageY - 80;

        if (adjustedX > 250) {
            adjustedX = 250;
        }

        let idPackinglist = item.idPackinglist;
        setContextMenuPosition({ x: adjustedX, y: adjustedY });
        setContextMenuVisible(true);
        setSelectedItem(idPackinglist);
    };

    const handleMenuColetar = async () => {
        setContextMenuVisible(false);

        const packingList = await fetchPackingListPorId(selectedItem);
        if (packingList) {

            navigation.navigate('Coleta', { idPackinglist: selectedItem });

        } else {
            Alert.alert(
                'Importar Packinglist',
                'Esta packinglist não foi importada. Deseja importá-la?',
                [
                    { text: 'Sim', onPress: () => handleImportarPackinglist() },
                    { text: 'Não', onPress: () => { }, style: 'cancel' },
                ],
                { cancelable: false }
            );
        }
    }

    const handleImportarPackinglist = async () => {
        setContextMenuVisible(false);
        const idPackinglist = selectedItem;
    
        const packinglist = await fetchPackingListPorId(selectedItem);
    
        if (!packinglist) {
            try {
                const response = await api.get(`/mobile-importacao/buscar-packinglist-inteira/${idPackinglist}`);
                const packingList = response.data.packingListImportacaoMobile;
                const packingListProdutoArray = response.data.packingListProdutoImportacaoMobile;
                const volumeProdutoArray = response.data.volumeProdutoImportacaoMobile;
                const volumeArray = response.data.volumeImportacaoMobile;
    
                console.log('item: ', response.data);
    
                // Salvar PackingList principal
                const packingListImportar = {
                    idPackinglist: packingList.idPackinglist,
                    nomeImportador: packingList.nomeImportador,
                    pesoLiquidoTotal: packingList.pesoLiquidoTotal,
                    pesoBrutoTotal: packingList.pesoBrutoTotal,
                    numeroColetas: packingList.numeroColetas
                };
    
                await insertPackingList(packingListImportar);
    
                // Salvar PackingListProduto
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
    
                // Salvar VolumeProduto
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
    
                // Salvar Volumes
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
    
                Alert.alert("PackingList importada com sucesso!");
            } catch (error) {
                console.log('Erro ao buscar PackingList: ', error);
            }
        } else {
            Alert.alert("Este PackingList já foi importado");
        }
    };
    


    const renderContextMenu = () => {
        if (!contextMenuVisible) return null;
        return (
            <View style={[style.contextMenu, { top: contextMenuPosition.y, left: contextMenuPosition.x }]}>
                <TouchableOpacity onPress={handleMenuColetar} style={style.botaoMenuColetar}>
                    <Text>Coletar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleImportarPackinglist} style={style.botaoMenuConferir}>
                    <Text>Importar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setContextMenuVisible(false)} style={style.botaoMenuConsultar}>
                    <Text>Consultar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const renderPackingListItem = ({ item, index }) => {
        const isLastItem = index === packinglistsExistentes.length - 1;

        return (
            <TouchableOpacity onPressIn={(e) => handlePressIn(e, item)}>
                <View style={[style.row, isLastItem && style.lastRow]}>
                    <Text style={style.cell}>{item.idPackinglist}</Text>
                    <Text style={style.cell}>{item.nomeClienteImportador}</Text>
                    <Text style={style.cell}>{item.numeroColetas ? item.numeroColetas : "0"}</Text>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <TouchableWithoutFeedback onPress={() => setContextMenuVisible(false)}>
            <View style={style.containerInicio}>
                <View style={style.containerBotaoRecarregar}>
                    <TouchableOpacity style={style.botaoImportadas}>
                        <Button
                            title="Importadas"
                            color={"black"}
                            onPress={() => navigation.navigate('Importadas')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={style.reloadPackinglist} onPress={fetchPackinglistsInicio}>
                        <Icon name="reload1" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={style.table}>
                    <View style={style.header}>
                        <Text style={style.headerCell}>ID</Text>
                        <Text style={style.headerCell}>Importador</Text>
                        <Text style={style.headerCell}>N° Coleta</Text>
                    </View>
                    <FlatList
                        data={packinglistsExistentes}
                        renderItem={renderPackingListItem}
                        keyExtractor={item => item.idPackinglist.toString()}
                    />
                </View>

                {renderContextMenu()}

                <BarraFooter navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );
}

const style = StyleSheet.create({
    containerInicio: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        width: '100%',
        height: '100%',
    },
    containerBotaoRecarregar: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingRight: 20,
        paddingBottom: 10,
        paddingLeft: 10,
    },
    botaoImportadas: {
        backgroundColor: '#ccc',
        borderRadius: '5px'
    },
    reloadPackinglist: {
        padding: 5
    },
    botaoMenuColetar: {
        backgroundColor: '#ccc',
        color: '#000',
        borderRadius: 3,
        padding: 6,
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoMenuConferir: {
        backgroundColor: '#ccc',
        color: '#000',
        borderRadius: 3,
        padding: 6,
        marginBottom: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    botaoMenuConsultar: {
        backgroundColor: '#ccc',
        color: '#000',
        borderRadius: 3,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
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
    row: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    lastRow: {
        borderBottomWidth: 0,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
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
