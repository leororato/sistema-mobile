import * as SQLite from 'expo-sqlite';

// Nome do banco de dados
const database_name = 'cofama_packinglist.db';

let db;

export const excluirDatabase = async () => {
    const db = SQLite.openDatabase(database_name);
    try {
        // Feche a conexão com o banco
        await db.closeAsync();
        console.log("Conexão com o banco fechada.");

        // Exclua o banco
        await SQLite.deleteDatabaseAsync("cofama_packinglist.db");
        console.log("Banco excluído com sucesso.");
    } catch (error) {
        console.error("Erro ao excluir o banco de dados:", error);
    }
};

// Conexão assíncrona com o banco de dados
export const getDBConnection = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync(database_name);
        console.log("Banco de dados aberto:", db);
    }
    return db;
};

