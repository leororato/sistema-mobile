import { createTable_mv_cliente, createTable_mv_coleta, createTable_mv_packinglist, createTable_mv_packinglist_produto, createTable_mv_tipo_volume, createTable_mv_usuario, createTable_mv_volume, createTable_mv_volumes_produto, excluirTodasTabelas } from "./criarTabelas";

export default function initializeDatabase() {

    const excluirTabelas = async () => {
        excluirTodasTabelas();
    }


    const initializeDB = async () => {
        await createTable_mv_usuario();
        await createTable_mv_tipo_volume();
        await createTable_mv_cliente();
        await createTable_mv_packinglist();
        await createTable_mv_volume();
        await createTable_mv_packinglist_produto();
        await createTable_mv_volumes_produto();
        await createTable_mv_coleta();
    };

     // excluirTabelas();
    initializeDB();
}