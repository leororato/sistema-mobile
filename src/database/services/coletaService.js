import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertColeta = async (data) => {
    const db = await getDBConnection();

    try {
        console.log("Dados para inserção:", data);

        const result = await db.runAsync(
            `INSERT INTO mv_coleta (
            idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario, dataHoraColeta, dataHoraImportacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                data.idPackinglist,
                data.idProduto,
                data.seq,
                data.idVolume,
                data.idVolumeProduto,
                data.idUsuario,
                data.dataHoraColeta,
                data.dataHoraImportacao
            ]
        );
        // console.log("Dados inseridos com sucesso:", result.lastInsertRowId);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};


export const fetchColetas = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_coleta');
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchColetasMaisRecentes = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_coleta ORDER BY dataHoraColeta DESC');
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchColetasPorProduto = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_coleta WHERE idPackinglist = ? AND idProduto = ? AND seq = ?', [idPackinglist, idProduto, seq]);
        
        return Array.isArray(allRows) ? allRows.length : 0;

    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const conferirSeJaFoiColetado = async (idPackinglist, idProduto, seq, idVolume, idVolumeProduto) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync(`SELECT * FROM mv_coleta WHERE idPackinglist = ? AND idProduto = ? AND seq = ? AND
             idVolume = ? AND idVolumeProduto = ?`, [idPackinglist, idProduto, seq, idVolume, idVolumeProduto]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coleta por ID:", error);
        throw error;
    }
}

export const fetchColetasListPorId = async (idColeta, idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync(`SELECT * FROM mv_coleta WHERE idColeta = ? AND idPackinglist = ? AND idProduto = ? AND seq = ? AND
             idVolume = ? AND idVolumeProduto = ? AND idUsuario = ?`, [idColeta, idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coleta por ID:", error);
        throw error;
    }
}

export const deletarTodasColetas = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_coleta');
        Alert.alert('Todas coletas foram removidas com sucesso');
    } catch (error) {
        console.error("Erro ao remover todas coletas:", error);
        throw error;
    }
}

export const deletarColetaPorId = async (idColeta, idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario) => {
    const db = await getDBConnection();
    try {
        await db.runAsync(`DELETE FROM mv_coleta WHERE idColeta = ? AND idPackinglist = ? AND idProduto = ? AND seq = ? AND
             idVolume = ? AND idVolumeProduto = ? AND idUsuario = ?`, [idColeta, idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario]);
        Alert.alert('Coleta removida com sucesso');
    } catch (error) {
        console.error("Erro ao remover coleta por ID:", error);
        throw error;
    }
}
