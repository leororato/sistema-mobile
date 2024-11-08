import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions, TouchableWithoutFeedback } from "react-native";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useEffect, useState } from "react";
import api from "../../../axiosConfig";
import Icon from 'react-native-vector-icons/AntDesign';
import { format } from 'date-fns';

export default function Inicio({ navigation }) {

    const [packinglistsExistentes, setPackinglistsExistentes] = useState([]);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchPackinglists();
    }, []);

    const fetchPackinglists = async () => {
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

    const handleMenuColetar = () => {
        setContextMenuVisible(false);
        // Navegar para a página Conferência, passando o idPackinglist como parâmetro
        navigation.navigate('Conferência', { idPackinglist: selectedItem });
    }
    

    const renderContextMenu = () => {
        if (!contextMenuVisible) return null;
        return (
            <View style={[style.contextMenu, { top: contextMenuPosition.y, left: contextMenuPosition.x }]}>
                <TouchableOpacity onPress={handleMenuColetar} style={style.botaoMenuColetar}>
                    <Text>Coletar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setContextMenuVisible(false)} style={style.botaoMenuConferir}>
                    <Text>Conferir</Text>
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
                <Text style={style.cell}>{formatarData(item.dtCriacao)}</Text>
            </View>
        </TouchableOpacity>
    );
};

    const formatarData = (dtCriacao) => {
        return format(new Date(dtCriacao), 'dd/MM/yyyy - HH:mm');
    };

    return (
        <TouchableWithoutFeedback onPress={() => setContextMenuVisible(false)}>
            <View style={style.containerInicio}>
                <View style={style.containerBotaoRecarregar}>
                    <TouchableOpacity onPress={fetchPackinglists}>
                        <Icon name="reload1" size={30} color="#000" />
                    </TouchableOpacity>
                </View>

                <View style={style.table}>
                    <View style={style.header}>
                        <Text style={style.headerCell}>ID</Text>
                        <Text style={style.headerCell}>Importador</Text>
                        <Text style={style.headerCell}>Data</Text>
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
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 10,
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
