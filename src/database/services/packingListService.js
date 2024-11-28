import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertPackingList = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_packinglist (
                idPackinglist, nomeImportador, pesoLiquidoTotal, pesoBrutoTotal,
                numeroColetas
            ) VALUES (?, ?, ?, ?, ?)`,
            [
                data.idPackinglist,
                data.nomeImportador,
                data.pesoLiquidoTotal,
                data.pesoBrutoTotal,
                data.numeroColetas
            ]
        );

    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};


export const fetchPackingLists = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_packinglist');

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

export const deletarPackinglistPorId = async (idPackinglist) => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_packinglist WHERE idPackinglist = ?', [idPackinglist]);
    } catch (error) {
        console.error("Erro ao remover packing list por ID:", error);
        throw error;
    }
}
