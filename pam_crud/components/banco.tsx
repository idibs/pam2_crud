import React, { useRef } from 'react';
import { StyleSheet, View, Button, TouchableOpacity, Text } from 'react-native';
import * as SQLite from 'expo-sqlite';

let db;
const App = () => {
    const editarClique = useRef(0);
    const deletarClique = useRef(0);
    async function Banco() {
        db = await SQLite.openDatabaseAsync('PAM2');
        if (db) {
            console.log("Banco criado");
            return db;
        }
        else {
            console.log("Erro ao criar Banco");
        }


    }

    async function CriarTabela() {

        db = await Banco();

        try {
            await db.execAsync(`
                PRAGMA journal_mode = WAL;
                CREATE TABLE IF NOT EXISTS TB_USUARIO (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 nome TEXT NOT NULL);`
            )
            console.log("tabela criada")
        } catch (erro) {
            console.log("Erro")
        }


    }

    async function Inserir() {
        db = await Banco();
        try {
            db.execAsync(
                ` INSERT INTO TB_USUARIO (nome)
                   VALUES ('Ricardo'),
                          ('Zé Matraca'),
                          ('Maria ');                          
                 `
            );
            console.log('Inserido');

        } catch (erro) {
            console.log('Erro' + erro)
        }


    }

    async function Exibir() {
        db = await Banco();
        const allRows = await db.getAllAsync('SELECT * FROM tb_usuario');
        for (const row of allRows) {
            console.log(row.id, row.nome);
        }
    }


    async function Editar() {
        const db = await Banco();
        editarClique.current++;

        const id = 1;
        const novoNome = editarClique.current === 1 ? "Carlos" : "João";

        try {
            await db.runAsync(
                `UPDATE TB_USUARIO SET nome = ? WHERE id = ?`,
                novoNome,
                id
            );
            console.log(`Editado: ID ${id} -> ${novoNome}`);
        } catch (erro) {
            console.log("Erro ao editar:", erro);
        }
    }

    async function Deletar() {
        const db = await Banco();
        deletarClique.current++;

        const id = deletarClique.current === 1 ? 2 : 3;

        try {
            await db.runAsync(
                `DELETE FROM TB_USUARIO WHERE id = ?`,
                id
            );
            console.log(`Deletado: ID ${id}`);
        } catch (erro) {
            console.log("Erro ao deletar:", erro);
        }
    }
    async function DropTabela() {
    const db = await Banco();
    try {
        await db.execAsync(`DROP TABLE IF EXISTS TB_USUARIO`);
        console.log("Tabela TB_USUARIO removida com sucesso");
    } catch (erro) {
        console.log("Erro ao remover tabela:", erro);
    }
}

    return (
        <View style={styles.container}>
            <CustomButton title="Criar Tabela" onPress={CriarTabela} />
            <CustomButton title="Inserir Dados" onPress={Inserir} />
            <CustomButton title="Exibir Dados" onPress={Exibir} />
            <CustomButton title="Editar" onPress={Editar} />
            <CustomButton title="Deletar (ID 2 / ID 3)" onPress={Deletar} />
            <CustomButton title="Drop Tabela (Excluir)" onPress={DropTabela} />
        </View>
    );
};

//botoes e componentes dele pra funfar bonitinho
const CustomButton = ({ title, onPress }) => (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        padding: 20,
        alignItems: 'center',
        gap: 10,
    },
    button: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
        marginVertical: 5,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default App;
