import { Alert } from "react-native";
import { getDBConnection } from "../database";

export const insertColeta = async (data) => {
    const db = await getDBConnection();

    try {

        const result = await db.runAsync(
            `INSERT INTO mv_coleta (
            idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario, nomeTelefone, dataHoraColeta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                data.idPackinglist,
                data.idProduto,
                data.seq,
                data.idVolume,
                data.idVolumeProduto,
                data.idUsuario,
                data.nomeTelefone,
                data.dataHoraColeta
            ]
        );
    } catch (error) {
        console.error("Erro ao inserir dados:", error);
        Alert.alert("Ocorreu um erro ao inserir dados: ", error.message);
    }
};

export const updateStatusExportacao = async (idColeta, novoStatus) => {
    const db = await getDBConnection();
    try {
        const query = `
           UPDATE mv_coleta
            SET statusExportacao = ?
            WHERE idPackinglist = ?
            AND idProduto = ?
            AND seq = ?
            AND idVolume = ?
            AND idVolumeProduto = ?
            AND idUsuario = ?
            AND nomeTelefone = ?
            AND dataHoraColeta = ?
        `;
        await db.execAsync(query, [novoStatus, idColeta]);
    } catch (error) {
        console.error("Erro ao atualizar statusExportacao:", error);
    }
};

export const alterarTabelaMvColeta = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            ALTER TABLE mv_coleta
            ADD COLUMN statusExportacao TINYINT DEFAULT 0;
        `);
    } catch (error) {
        console.error("Erro ao alterar tabela mv_coleta:", error);
    }
};

export const fetchColetas = async () => {
    const db = await getDBConnection();
    try {
        const allRows = await db.getAllAsync('SELECT * FROM mv_coleta');
        return allRows;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchColetaPorIdColeta = async (idColeta) => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync('SELECT * FROM mv_coleta WHERE idColeta = ?', [idColeta]);
        return response;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const verificarStatusExportacao = async () => {
    const db = await getDBConnection();
    try {
        const resposne = await db.getAllAsync('SELECT * FROM mv_coleta c WHERE c.statusExportacao = 0');
        let statusExportacao;
        if (resposne.length > 0) {
            statusExportacao = true;
        } else {
            statusExportacao = false;
        }
        return statusExportacao;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};


export const fetchColetasParaExportacao = async () => {
    const db = await getDBConnection();
    try {
        const coletas = await db.getAllAsync('SELECT idPackinglist, idProduto, seq, idVolume, idVolumeProduto, idUsuario, nomeTelefone, dataHoraColeta FROM mv_coleta');
        return coletas;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchItensColetadosDeUmProduto = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const resposne = await db.getAllAsync(`SELECT c.idColeta, c.idPackinglist, c.idProduto, c.seq, c.dataHoraColeta, v.descricao, vv.seqVolume
        FROM mv_coleta c
        LEFT JOIN mv_volume v
        ON c.idVolume = v.idVolume
        LEFT JOIN mv_volumes_produto vv
        ON c.idVolume = vv.idVolume
        WHERE c.idPackinglist = ? AND c.idProduto = ? AND c.seq = ? 
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
        const response = await db.getAllAsync(`
        SELECT c.idColeta, c.idPackinglist, c.idProduto, c.seq, c.dataHoraColeta, v.descricao, vv.seqVolume
        FROM mv_coleta c
        LEFT JOIN mv_volume v
        ON c.idVolume = v.idVolume
        LEFT JOIN mv_volumes_produto vv
        ON c.idVolume = vv.idVolume
        ORDER BY dataHoraColeta DESC
        `);

        return response;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchNaoColetados = async () => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync(`SELECT vv.idVolumeProduto, vv.idPackinglist, vv.idProduto, vv.seq, vv.idVolume, v.descricao, vv.seqVolume
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
        return response;
    } catch (error) {
        console.error("Erro ao buscar coletas:", error);
        throw error;
    }
};

export const fetchNaoColetadosPorProduto = async (idPackinglist, idProduto, seq) => {
    const db = await getDBConnection();
    try {
        const response = await db.getAllAsync(`
            SELECT vv.idVolumeProduto, vv.idPackinglist, vv.idProduto, vv.seq, vv.idVolume, v.descricao, vv.seqVolume 
            FROM mv_volumes_produto vv LEFT JOIN mv_coleta c
            ON vv.idPackinglist = c.idPackinglist
            AND vv.idProduto = c.idProduto
            AND vv.seq = c.seq
            AND vv.idVolume = c.idVolume
            AND vv.idVolumeProduto = c.idVolumeProduto
            LEFT JOIN 
            mv_volume v 
            ON vv.idVolume = v.idVolume
            WHERE 
            vv.idPackinglist = ? 
            AND vv.idProduto = ? 
            AND vv.seq = ? 
            AND c.idColeta IS NULL;

        `, [idPackinglist, idProduto, seq]);

        return response;
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

export const deletarColetaPorIdColeta = async (idColeta) => {
    const db = await getDBConnection();
    try {
        await db.runAsync(`DELETE FROM mv_coleta WHERE idColeta = ?`, [idColeta]);

    } catch (error) {
        console.error("Erro ao remover coleta por ID:", error);
        throw error;
    }
}