import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertPackingList = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_packinglist (
                idPackinglist, nomeImportador, pesoLiquidoTotal, pesoBrutoTotal,
                numeroColetas, idUsuario
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.idPackinglist,
                data.nomeImportador,
                data.pesoLiquidoTotal,
                data.pesoBrutoTotal,
                data.numeroColetas,
                data.idUsuario
            ]
        );

    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};

export const alterarTabelaPackinglist = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            ALTER TABLE mv_packinglist
            ADD COLUMN idUsuario BIGINT;
        `);
    } catch (error) {
        console.error("Erro ao alterar tabela mv_coleta:", error);
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

export const fetchIdUsuarioDaPackinglist = async (idPackinglist) => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync('SELECT idUsuario FROM mv_packinglist WHERE idPackinglist = ?', [idPackinglist]);
        return response;
    } catch (error) {
        console.error("Erro ao buscar packing lists:", error);
        throw error;
    }
};

export const fetchPackingListsQuantidade = async () => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync('SELECT * FROM mv_packinglist');

        return response.length;
    } catch (error) {
        console.error("Erro ao buscar packing lists:", error);
        throw error;
    }
};

export const fetchPackingListPorId = async (idPackinglist) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync('SELECT * FROM mv_packinglist WHERE idPackinglist = ?', [idPackinglist]);
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
