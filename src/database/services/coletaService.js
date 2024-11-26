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

export const fetchItensColetadosDeUmProduto = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const resposne = await db.getAllAsync(`SELECT c.idPackinglist, c.idProduto, c.seq, c.dataHoraColeta, v.descricao
        FROM mv_coleta c
        LEFT JOIN mv_volume v
        ON c.idVolume = v.idVolume
        WHERE idPackinglist = ? AND idProduto = ? AND seq = ? 
        ORDER BY dataHoraColeta DESC`, [idPackinglist, idProduto, seq]);
        return resposne;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchColetasMaisRecentes = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync(`
        SELECT c.idPackinglist, c.idProduto, c.seq, c.dataHoraColeta, v.descricao
        FROM mv_coleta c
        LEFT JOIN mv_volume v
        ON c.idVolume = v.idVolume
        ORDER BY dataHoraColeta DESC
        `);
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

// export const fetchColetasMaisRecentes = async () => {
//     const db = await getDBConnection();
//     try {
//         const allRows = await db.getAllAsync('SELECT * FROM mv_coleta ORDER BY dataHoraColeta DESC');

//         return allRows;
//     } catch (error) {
//         console.error("Erro ao buscar coletas:", error);
//         throw error;
//     }
// };

export const fetchNaoColetados = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync(`SELECT vv.idVolumeProduto, vv.idPackinglist, vv.idProduto, vv.seq, vv.idVolume, v.descricao
            FROM mv_volumes_produto vv
            LEFT JOIN mv_coleta c
                ON vv.idPackinglist = c.idPackinglist
                AND vv.idProduto = c.idProduto
                AND vv.seq = c.seq
                AND vv.idVolume = c.idVolume
                AND vv.idVolumeProduto = c.idVolumeProduto
            LEFT JOIN mv_volume v 
            ON vv.idVolume = v.idVolume
            WHERE c.idColeta IS NULL;
        `);
        console.log("Dados buscados com sucesso:", allRows);
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

export const fetchProdutosQueTiveramColetas = async () => {
    const db = await getDBConnection();

    try {
        const response = await db.getAllAsync(`
            SELECT DISTINCT pp.idProduto, pp.idPackinglist, pp.seq, pp.*
            FROM mv_coleta c
            JOIN mv_packinglist_produto pp 
            ON c.idPackinglist = pp.idPackinglist
            AND c.idProduto = pp.idProduto
            AND c.seq = pp.seq
        `);
        return response;
    } catch (error) {
        console.log("Erro ao buscar produtos que tiveram coletas");
        throw error;
    }
}

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
