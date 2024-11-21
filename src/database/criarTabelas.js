import { getDBConnection } from './database';

export const excluirTodasTabelas = async () => {
    const tabelas = [
        "mv_volumes_produto", 
        "mv_volume",
        "mv_packinglist_produto",
        "mv_packinglist",
        "mv_coleta",
        "mv_tipo_volume",
        "mv_usuario",
        "mv_cliente"
    ];

    const db = await getDBConnection();

    try {
        // Desabilitar restrições de chave estrangeira para permitir exclusões sem problemas
        await db.execAsync("PRAGMA foreign_keys = OFF");

        for (const tabela of tabelas) {
            await db.execAsync(`DROP TABLE IF EXISTS ${tabela}`);
            console.log(`Tabela ${tabela} excluída com sucesso.`);
        }

        // Reabilitar restrições de chave estrangeira após as exclusões
        await db.execAsync("PRAGMA foreign_keys = ON");

    } catch (error) {
        console.error("Erro ao excluir tabelas:", error);
    }
};

export const createTable_mv_coleta = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_coleta (
            idColeta INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            idPackinglist BIGINT NOT NULL,
            idProduto BIGINT NOT NULL,
            seq BIGINT NOT NULL,
            idVolume BIGINT NOT NULL,
            idVolumeProduto BIGINT NOT NULL,
            idUsuario BIGINT,
            dataHoraColeta DATETIME,
            dataHoraImportacao DATETIME,
            FOREIGN KEY (idPackinglist) REFERENCES mv_packinglist (idPackinglist),
            FOREIGN KEY (idProduto, seq, idPackinglist) REFERENCES mv_packinglist_produto (idProduto, seq, idPackinglist),
            FOREIGN KEY (idVolumeProduto, idPackinglist, idProduto, seq, idVolume) REFERENCES mv_volumes_produto (idVolumeProduto, idPackinglist, idProduto, seq, idVolume),
            FOREIGN KEY (idUsuario) REFERENCES mv_usuario (id)
            );
        `)
        console.log("Tabela mv_coleta criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_coleta:", error);
    }
}

export const createTable_mv_tipo_volume = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_tipo_volume (
            idTipoVolume BIGINT,
            descricao VARCHAR,
            registro_criado_por BIGINT,
            registro_alterado_por BIGINT,
            registro_criado DATETIME,
            registro_alterado DATETIME,
            registro_deletado TINYINT,
            PRIMARY KEY (idTipoVolume)
            )
            `)
        console.log("Tabela mv_tipo_volume criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_tipo_volume:", error);
    }
}

export const createTable_mv_usuario = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_usuario (
            id bigint NOT NULL,
            nome varchar(255) NOT NULL,
            login varchar(100) NOT NULL,
            senha char(50) NOT NULL,
            nivelAcesso char(1) NOT NULL,
            ativo char(1) NOT NULL,
            PRIMARY KEY (id)
            )
            `)
        console.log("Tabela mv_usuario criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_usuario:", error);
    }
}

export const createTable_mv_cliente = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_cliente (
            idCliente BIGINT,
            SiglaCodigoIdentificacao VARCHAR,
            codigoIdentificacao VARCHAR,
            registro_criado_por BIGINT,
            registro_alterado_por BIGINT,
            registro_criado DATETIME,
            registro_alterado DATETIME,
            registro_deletado TINYINT,
            PRIMARY KEY (idCliente)
            )
            `)
    } catch (error) {
        console.error("Erro ao criar tabela mv_cliente:", error);
    }

}

export const createTable_mv_volumes_produto = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_volumes_produto (
            idVolumeProduto bigint NOT NULL,
            idPackinglist bigint NOT NULL,
            idProduto bigint NOT NULL,
            seq bigint NOT NULL,
            idVolume bigint NOT NULL,
            qrCodeVolumeProduto varchar(255) NOT NULL,
            seqVolume bigint NOT NULL,
            PRIMARY KEY (idVolumeProduto, idPackinglist, idProduto, seq, idVolume)
            )
            `)
        console.log("Tabela mv_volumes_produto criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_volumes_produto:", error);
    }
}

export const createTable_mv_volume = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_volume (
            idVolume bigint NOT NULL,
            idTipoVolumeId bigint NOT NULL,
            quantidadeItens bigint NOT NULL,
            descricao varchar(255) NOT NULL,
            pesoLiquido decimal(10,3) NOT NULL,
            pesoBruto decimal(10,3) NOT NULL,
            PRIMARY KEY (idVolume)
            )
            `)
        console.log("Tabela mv_volume criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_volume:", error);
    }
}

export const createTable_mv_packinglist_produto = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_packinglist_produto (
            idPackinglist bigint NOT NULL,
            idProduto bigint NOT NULL,
            seq bigint NOT NULL,
            produto varchar(150) NOT NULL,
            descricaoProduto varchar(500) NOT NULL,
            ordemProducao varchar(100) DEFAULT NULL,
            totalPesoLiquido decimal(10,3) DEFAULT NULL,
            totalPesoBruto decimal(10,3) DEFAULT NULL,
            numeroSerie bigint DEFAULT NULL,
            PRIMARY KEY (idPackinglist,idProduto,seq)
            );
        `);
        console.log("Tabela mv_packinglist_produto criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_packinglist_produto:", error);
    }
}

export const createTable_mv_packinglist = async () => {
    const db = await getDBConnection();
    try {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS mv_packinglist (
                idPackinglist bigint NOT NULL,
                nomeImportador varchar(150) DEFAULT NULL,
                pesoLiquidoTotal decimal(10,3) DEFAULT NULL,
                pesoBrutoTotal decimal(10,3) DEFAULT NULL,
                numeroColetas bigint DEFAULT '0',
                PRIMARY KEY (idPackinglist)
            );
        `);
        console.log("Tabela mv_packinglist criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_packinglist:", error);
    }
};
