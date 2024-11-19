import { getDBConnection } from './database';

export const excluirTodasTabelas = async () => {
    const tabelas = [
        "mv_tipo_volume",
        "mv_usuario",
        "mv_cliente",
        "mv_volumes_produto",
        "mv_volume",
        "mv_packinglist_produto",
        "mv_packinglist"
    ];

    const db = await getDBConnection();

    try {
        for (const tabela of tabelas) {
            await db.execAsync(`DROP TABLE IF EXISTS ${tabela}`);
            console.log(`Tabela ${tabela} excluída com sucesso.`);
        }
    } catch (error) {
        console.error("Erro ao excluir tabelas:", error);
    }
};

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
            registro_deletado TINYINT
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
            dtCriacao datetime NOT NULL,
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
            registro_deletado TINYINT
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
            dtCriacao datetime NOT NULL,
            registro_criado_por bigint NOT NULL,
            registro_alterado_por bigint DEFAULT NULL,
            registro_criado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_alterado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_deletado tinyint(1) DEFAULT '0',
            seqVolume bigint NOT NULL
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
            altura varchar(20) DEFAULT NULL,
            largura varchar(20) DEFAULT NULL,
            comprimento varchar(20) DEFAULT NULL,
            pesoLiquido decimal(10,3) NOT NULL,
            pesoBruto decimal(10,3) NOT NULL,
            observacao varchar(255) DEFAULT NULL,
            registro_criado_por bigint NOT NULL,
            registro_alterado_por bigint DEFAULT NULL,
            registro_criado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_alterado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_deletado tinyint(1) DEFAULT '0',
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
            altura varchar(20) DEFAULT NULL,
            largura varchar(20) DEFAULT NULL,
            comprimento varchar(20) DEFAULT NULL,
            registro_criado_por bigint NOT NULL,
            registro_alterado_por bigint DEFAULT NULL,
            registro_criado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_alterado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            registro_deletado tinyint(1) DEFAULT '0',
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
                dtCriacao datetime NOT NULL,
                idImportador bigint NOT NULL,
                idConsignatario bigint DEFAULT NULL,
                idNotificado bigint DEFAULT NULL,
                paisOrigem varchar(500) DEFAULT NULL,
                fronteira varchar(500) DEFAULT NULL,
                localEmbarque varchar(500) DEFAULT NULL,
                localDestino varchar(500) DEFAULT NULL,
                TermosPagamento varchar(500) DEFAULT NULL,
                dadosBancarios varchar(500) DEFAULT NULL,
                INCOTERM varchar(200) DEFAULT NULL,
                INVOICE varchar(200) DEFAULT NULL,
                meioTransporte varchar(200) DEFAULT NULL,
                pesoLiquidoTotal decimal(10,3) DEFAULT NULL,
                pesoBrutoTotal decimal(10,3) DEFAULT NULL,
                idioma varchar(200) NOT NULL,
                finalizado tinyint(1) DEFAULT '0',
                registro_criado_por bigint NOT NULL,
                registro_alterado_por bigint DEFAULT NULL,
                registro_criado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                registro_alterado datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                registro_deletado tinyint(1) DEFAULT '0',
                numeroColetas bigint DEFAULT '0',
                PRIMARY KEY (idPackinglist)
            );
        `);
        console.log("Tabela mv_packinglist criada com sucesso.");
    } catch (error) {
        console.error("Erro ao criar tabela mv_packinglist:", error);
    }
};
