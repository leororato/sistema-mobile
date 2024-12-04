import { getDBConnection } from "../database";

export const insertDeletarColeta = async (data) => {
    const db = await getDBConnection();

    try {
        const result = await db.runAsync(
            `INSERT INTO mv_itens_deletar (
            idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario, nomeTelefone, dataHoraColeta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
            data
        );
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
    }
};

export const fetchTodasColetasDeletadas = async () => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync('SELECT * FROM mv_itens_deletar');
        return response;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const deletarTodosItensDeletados = async () => {
    const db = await getDBConnection();
    try {
        await db.runAsync('DELETE FROM mv_itens_deletar');
    } catch (error) {
        console.error("Erro ao remover todos Itens Deletados", error);
        throw error;
    }
}