import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertVolume = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_volume (
                idVolume, idTipoVolumeId, quantidadeItens, descricao,
                pesoLiquido, pesoBruto
            ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                data.idVolume,
                data.idTipoVolumeId,
                data.quantidadeItens,
                data.descricao,
                data.pesoLiquido,
                data.pesoBruto
            ]
        );
       // console.log("Dados inseridos com sucesso:", result.lastInsertRowId);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};


export const fetchVolumes = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_volume');
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar volumes:", error);
        throw error;
    }
};

export const fetchDescricaoVolume = async (idVolume) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT descricao FROM mv_volume WHERE idVolume = ?', [idVolume]);
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar volumes:", error);
        throw error;
    }
};

export const fetchVolumesPorId = async (idVolume) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync('SELECT * FROM mv_volume WHERE idVolume = ?', [idVolume]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar volume por ID:", error);
        throw error;
    }
}

export const deletarTodosVolumesImportados = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_volume');
        Alert.alert('Todos volumes importados foram removidos com sucesso');
    } catch (error) {
        console.error("Erro ao remover todos volumes importados:", error);
        throw error;
    }
}

export const deletarVolumesPorId = async (idVolume) => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_volume WHERE idVolume = ?', [idVolume]);
        Alert.alert('Volume removido com sucesso');
    } catch (error) {
        console.error("Erro ao remover volume por ID:", error);
        throw error;
    }
}
