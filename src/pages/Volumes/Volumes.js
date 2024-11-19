import { Button, StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import BarraFooter from "../../components/barraFooter/BarraFooter";
import { useState } from "react";
import Icon from 'react-native-vector-icons/AntDesign';
import api from "../../../axiosConfig";

export default function Volumes({ navigation }) {

    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [volumes, setVolumes] = useState([]);
 
    const coletar = () => {

    }

    const buscarVolumes = async () => {
        try {
            
        } catch (error) {

        }
    }

    const renderVolumes = ({ item, index }) => {
        const isLastItem = index === volumes.length - 1;

        return (
            <TouchableOpacity onPressIn={(e) => handlePressIn(e, item)}>
                <View style={[style.row, isLastItem && style.lastRow]}>
                    <Text style={style.cell}>{item.idVolume}</Text>
                    <Text style={style.cell}>{item.descricao}</Text>
                    <Text style={style.cell}>{formatarData(item.quantidadeItens)}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderContextMenu = () => {
        if (!contextMenuVisible) return null;
        return (
            <View style={[style.contextMenu, { top: contextMenuPosition.y, left: contextMenuPosition.x }]}>
                <TouchableOpacity onPress={""} style={style.botaoMenuColetar}>
                    <Text>Coletar</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return(
        <TouchableWithoutFeedback onPress={() => setContextMenuVisible(false)}>
            <View style={style.containerInicio}>
                <View style={style.containerBotaoRecarregar}>
                    <TouchableOpacity style={style.botaoLimparTodasPl}>
                        <Button
                            title="Coletar"
                            color={"black"}
                            onPress={() => coletar()}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={buscarVolumes}>
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
                        data={volumes}
                        renderItem={renderVolumes}
                        keyExtractor={item => item.idVolume.toString()}
                    />
                </View>

                {renderContextMenu()}

                <BarraFooter navigation={navigation} />
            </View>
        </TouchableWithoutFeedback>
    );

}


const style = StyleSheet.create({
    containerImportados: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
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
        justifyContent: 'space-around',        
        alignItems: 'flex-end',
        paddingRight: 20,
        paddingBottom: 10,
    },
    botaoLimparTodasPl: {
        backgroundColor: "#ccc"
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
