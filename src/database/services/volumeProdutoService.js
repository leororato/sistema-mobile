import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertVolumesProdutos = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_volumes_produto (
                idVolumeProduto, idPackinglist, idProduto, seq, idVolume, qrCodeVolumeProduto, seqVolume
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                data.idVolumeProduto,
                data.idPackinglist,
                data.idProduto,
                data.seq,
                data.idVolume,
                data.qrCodeVolumeProduto,
                data.seqVolume
            ]
        );
       // console.log("Dados inseridos com sucesso:", result.lastInsertRowId);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};


export const fetchVolumesProdutos = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_volumes_produto');
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar volumes produtos:", error);
        throw error;
    }
};

export const fetchVolumesProdutosPorId = async (idVolumeProduto, idPackinglist, idProduto, seq, idVolume) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync('SELECT * FROM mv_volumes_produto WHERE idVolumeProduto = ? AND idPackinglist = ? AND idProduto = ? AND seq = ? AND idVolume = ?', [idVolumeProduto, idPackinglist, idProduto, seq, idVolume]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar volumeProduto por ID:", error);
        throw error;
    }
}

export const fetchQuantidadeVolumesProdutosDeUmProduto = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const response = await db.getFirstAsync('SELECT COUNT(*) AS quantidade FROM mv_volumes_produto WHERE idPackinglist = ? AND idProduto = ? AND seq = ?', [idPackinglist, idProduto, seq]);
        return response.quantidade; 
        // Array.isArray(allRows) ? allRows.length : 0;
    } catch (error) {
        console.error("Erro ao buscar volumeProduto por ID:", error);
        throw error;
    }
}

export const deletarTodosVolumesProdutosImportados = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_volumes_produto');
        Alert.alert('Todos volumes_produtos importados foram removidos com sucesso');
    } catch (error) {
        console.error("Erro ao remover todos volumes_produtos importados:", error);
        throw error;
    }
}

export const deletarVolumeProdutoPorId = async (idVolumeProduto, idPackinglist, idProduto, seq, idVolume) => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_volumes_produto WHERE idVolumeProduto = ? AND idPackinglist = ? AND idProduto = ? AND seq = ? AND idVolume = ?', [idVolumeProduto, idPackinglist, idProduto, seq, idVolume]);
        Alert.alert('VolumeProduto removido com sucesso');
    } catch (error) {
        console.error("Erro ao remover volumeProduto por ID:", error);
        throw error;
    }
}
