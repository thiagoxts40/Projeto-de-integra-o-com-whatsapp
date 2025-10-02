import fs from 'fs/promises';

const MemoryJSON = "salvar/chatMemory.json";
let chatMemory = {};

async function load() {
    try {
        const data = await fs.readFile(MemoryJSON, 'utf-8');
        chatMemory = JSON.parse(data);
        console.log("Memória carregada.")
    } catch (error) {
        console.log("Sem memória salva.")
    }
}

async function save() {
    try {
        const jsonString = JSON.stringify(chatMemory, null, 2);
        await fs.writeFile(MemoryJSON, jsonString, 'utf-8');
        console.log("chatMemory.json salvo");
    } catch (error) {
        console.error("Erro ao salvar a memória:", error);
    }
}


function getMemory() {
    console.log("Carregando bot...")
    return chatMemory;
}

export default {
    load,
    save,
    getMemory
};