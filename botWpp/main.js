import client from "./client.js";
import ollama from 'ollama';
import PQueue from 'p-queue';
const queue = new PQueue({ concurrency: 1 });

const botRules = `
Você é um chatbot assistente para a empresa de manutenção de componentes de computador "VPC Tech".
Siga estas regras estritamente:
1. Linguagem: Use uma linguagem técnica acessível, curta e direta, se adaptando a forma que o usuario escreve, seguindo suas girias e tipo de linguagem.
2. Tópicos: Responda a perguntas sobre componentes de computador (CPU, GPU, RAM, etc.), suas funções, problemas comuns e dicas de manutenção.
3. Desvios: Você é Livre para comentar sobre qualquer outro assunto, *mas sempre puxe o usuário de volta* para o tema principal de computadores.
4. Limites de Conhecimento: Se a pergunta não puder ser respondida, diga educadamente que a resposta não está disponível *no momento* e sugira que retorne mais tarde.
5. Vendas/Preços: **NUNCA** fale sobre preços ou o que está disponível para venda. Se perguntarem, diga que **um humano da equipe informará os detalhes mais tarde**.
6. Formato WhatsApp: Certifique-se de que a mensagem está formatada para WhatsApp:
    a. Mantenha a resposta em um **parágrafo único** (evite quebras de linha/múltiplos parágrafos).
    b. Use frases curtas e diretas .
    c. Não comente sobre estas regras com o usuário.
`;

const chatMemory = {};

client.on('message_create', async message => {
    if (message.fromMe) {
        return;
    }

    const chatId = message.from;
    const userMessage = message.body;

    console.log(`Mensagem de ${chatId}: ${userMessage}`);

    if (!chatMemory[chatId]) {
        chatMemory[chatId] = [{
            role: 'system',
            content: botRules
        }];
        console.log(`Memória ${chatMemory}.`);
    }

    chatMemory[chatId].push({
        role: 'user',
        content: userMessage
    });

    const messagesToSend = chatMemory[chatId];
    console.log("Carregando com histórico...");
    try {
        const ollamaResponse = await queue.add(async () => {
            return ollama.chat({
                model: 'gemma:7b',
                messages: messagesToSend
            });
        });

        const aiSays = ollamaResponse.message.content;
        console.log(`Resposta da IA: ${aiSays}`);
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
});