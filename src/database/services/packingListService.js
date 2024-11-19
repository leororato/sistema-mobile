import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertPackingList = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_packinglist (
                dtCriacao, idImportador, idConsignatario, idNotificado,
                paisOrigem, fronteira, localEmbarque, localDestino, 
                TermosPagamento, dadosBancarios, INCOTERM, INVOICE, 
                meioTransporte, pesoLiquidoTotal, pesoBrutoTotal, idioma, 
                finalizado, registro_criado_por, registro_alterado_por, 
                registro_criado, registro_alterado, registro_deletado, 
                numeroColetas
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.dtCriacao,
                data.idImportador,
                data.idConsignatario,
                data.idNotificado,
                data.paisOrigem,
                data.fronteira,
                data.localEmbarque,
                data.localDestino,
                data.TermosPagamento,
                data.dadosBancarios,
                data.INCOTERM,
                data.INVOICE,
                data.meioTransporte,
                data.pesoLiquidoTotal,
                data.pesoBrutoTotal,
                data.idioma,
                data.finalizado,
                data.registro_criado_por,
                data.registro_alterado_por,
                data.registro_criado,
                data.registro_alterado,
                data.registro_deletado,
                data.numeroColetas
            ]
        );
       // console.log("Dados inseridos com sucesso:", result.lastInsertRowId);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};



export const fetchPackingLists = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_packinglist');
       // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar packing lists:", error);
        throw error;
    }
};

export const fetchPackingListPorId = async (id) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync('SELECT * FROM mv_packinglist WHERE idPackinglist = ?', [id]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar packing list por ID:", error);
        throw error;
    }
}

export const deletarTodasPackinglistsImportadas = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_packinglist');
        Alert.alert('Todos packinglists importados foram removidos com sucesso');
    } catch (error) {
        console.error("Erro ao remover todos packing lists importados:", error);
        throw error;
    }
}

export const deletarPackinglistPorId = async (id) => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_packinglist WHERE idPackinglist = ?', [id]);
        Alert.alert('Packinglist removido com sucesso');
    } catch (error) {
        console.error("Erro ao remover packing list por ID:", error);
        throw error;
    }
}
