//npm run start
import MemoryManager from './memoryManager.js';
import client from "./client.js";
import ollama from "ollama";
import PQueue from "p-queue";
import freeDays from "./client-products/agenda.js";
import estoque from "./client-products/estoque.js";
import botRules from "./client-products/regrasBot.js";

const queue = new PQueue({ concurrency: 1 });

let guideBot = `
${botRules}

agenda de horários livres
${freeDays}

estoque de produtos 
${estoque}
`

await MemoryManager.load();
const chatMemory = MemoryManager.getMemory();

client.on('message_create', async message => {
    if (message.fromMe) {
        console.log(`${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()} - Resposta IA || HUMANO: ${message.body}`)
        return;
    }

    const chatId = message.from;
    const userMessage = message.body;

    console.log(`${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()} - Mensagem de ${chatId}: '${userMessage}'`);
    console.log("... ⏳");

    if (!chatMemory[chatId]) {
        chatMemory[chatId] = [{
            role: 'system',
            content: guideBot
        }];
    }

    let messagesToSend = chatMemory[chatId];

    chatMemory[chatId].push({
        role: 'user',
        content: `${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()} user: ${userMessage}`
    });

    try {
        const ollamaResponse = await queue.add(async () => {
            return ollama.chat({
                model: 'llama3:8b',
                messages: messagesToSend
            });
        });

        const aiSays = ollamaResponse.message.content;
        await message.reply(aiSays);

        chatMemory[chatId].push({
            role: 'assistant',
            content: aiSays
        });

    } catch (err) {
        console.error("Erro:", err);
        client.sendMessage(chatId, "Não consigo responder agora. Tenta mais tarde :>");
        chatMemory[chatId].pop();
    }

    const maxMemory = 6;

    if (chatMemory[chatId] && chatMemory[chatId].length > maxMemory) {
        const itemsToRemove = chatMemory[chatId].length - maxMemory;
        chatMemory[chatId].splice(1, itemsToRemove);
    }
    await MemoryManager.save();
});