import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertPackingListProduto = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_packinglist_produto (
                idPackinglist, idProduto, seq, produto,
                descricaoProduto, ordemProducao, totalPesoLiquido, totalPesoBruto, 
                numeroSerie
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.idPackinglist,
                data.idProduto,
                data.seq,
                data.produto,
                data.descricaoProduto,
                data.ordemProducao,
                data.totalPesoLiquido,
                data.totalPesoBruto,
                data.numeroSerie
            ]
        );
       // console.log("Dados inseridos com sucesso:", result.lastInsertRowId);
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};


export const fetchPackingListProdutos = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_packinglist_produto');
        // console.log("Dados buscados com sucesso:", allRows);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar packinglists_produtos:", error);
        throw error;
    }
};

export const fetchPackingListProdutoPorId = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getFirstAsync('SELECT * FROM mv_packinglist_produto WHERE idPackinglist = ? AND idProduto = ? AND seq =  ?', [idPackinglist, idProduto, seq]);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar packing list por ID:", error);
        throw error;
    }
}

export const deletarTodasPackinglistProdutosImportadas = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_packinglist_produto');
        Alert.alert('Todos packinglists_produtos importados foram removidos com sucesso');
    } catch (error) {
        console.error("Erro ao remover todos packinglists_produtos importados:", error);
        throw error;
    }
}

export const deletarPackinglistPorId = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_packinglist_produto WHERE idPackinglist = ? AND idProduto = ? AND seq =  ?', [idPackinglist, idProduto, seq]);
        Alert.alert('Packinglist removido com sucesso');
    } catch (error) {
        console.error("Erro ao remover packing list por ID:", error);
        throw error;
    }
}
