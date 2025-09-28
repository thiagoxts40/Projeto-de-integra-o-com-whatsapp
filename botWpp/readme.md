
-----

# Documentação do Projeto: VPC Tech Chatbot

Este projeto implementa um **chatbot assistente** para a empresa de manutenção de componentes de computador **VPC Tech**. Ele utiliza o **WhatsApp** como interface de comunicação e o **Ollama/Gemma** para processamento de linguagem natural, gerenciando o tráfego de requisições com o **PQueue**.

-----

## Tecnologias Utilizadas

| Tecnologia | Função Principal |
| :--- | :--- |
| **`whatsapp-web.js`** | Integração e interface com o WhatsApp. |
| **`ollama`** | Conexão com o modelo de Linguagem Grande (**LLM**) `gemma:7b` para gerar respostas. |
| **`PQueue`** | Limita a concorrência a 1, garantindo que apenas uma requisição Ollama seja processada por vez. |
| **`qrcode-terminal`** | Exibe o QR Code para login no WhatsApp diretamente no terminal. |
| **Node.js** | Ambiente de execução. |

-----

## Estrutura de Arquivos

O projeto é dividido em dois arquivos principais:

### 1\. `client.js` (Gerenciamento do WhatsApp)

Este arquivo é responsável por inicializar e configurar a conexão com o WhatsApp.

| Recurso | Descrição |
| :--- | :--- |
| `LocalAuth` | Salva o estado da sessão (login) na pasta `salvar/`, evitando a necessidade de escanear o QR Code a cada reinicialização. |
| Evento `qr` | Gera e exibe o QR Code no terminal para o login inicial do WhatsApp. |
| Evento `ready` | Confirma que a conexão com o WhatsApp foi estabelecida com sucesso. |
| `export default client` | Exporta a instância configurada do cliente WhatsApp para uso no `main.js`. |

### 2\. `main.js` (Lógica do Chatbot e IA)

Este é o coração do assistente. Ele gerencia as regras, a memória do chat, e a interação com a IA (Ollama).

#### A. Inicialização e Controle de Fluxo

1.  **`PQueue`:** Inicializado com `concurrency: 1`. Isso é crucial para evitar que múltiplas mensagens sobrecarreguem o serviço Ollama, processando as requisições sequencialmente.
    ```javascript
    const queue = new PQueue({ concurrency: 1 });
    ```
2.  **`chatMemory`:** Objeto global usado para armazenar o histórico de conversas de cada usuário (`chatId`), permitindo que a IA mantenha o **contexto** da conversa.

#### B. As `botRules` (Regras de Negócio)

As regras são injetadas no histórico de cada chat como a mensagem inicial do sistema (`role: 'system'`). Elas definem o comportamento e o tom de voz do bot:

  * **Foco Técnico:** Componentes e manutenção de computadores.
  * **Tom de Voz:** Curto, direto, técnico e adaptável à linguagem do usuário.
  * **Desvio de Assunto:** O bot sempre tenta retornar ao tema principal de computadores.
  * **Limites:** Se a resposta não estiver disponível, o bot sugere retornar mais tarde.
  * **Vendas/Preços:** **Nunca** fala de preços ou vendas, encaminhando o usuário para um humano.
  * **Formato WhatsApp:** Respostas formatadas em um **único parágrafo** para otimização no app.

#### C. Fluxo de Mensagens (`client.on('message_create', ...)`)

1.  **Pré-Processamento:** Ignora mensagens enviadas pelo próprio bot e carrega ou inicializa a `chatMemory` para o `chatId` atual, incluindo as `botRules`.
2.  **Adição à Fila:** A chamada ao `ollama.chat` é encapsulada em `await queue.add(async () => { ... })`. Isso garante que o processamento da IA para esta mensagem só comece após todas as requisições anteriores na fila terem terminado.
3.  **Resposta:** Após a resposta da IA ser gerada e retornada pela fila, ela é enviada de volta ao usuário (`await message.reply(aiSays)`).
4.  **Atualização de Memória:** A resposta da IA é salva no `chatMemory` para o contexto das próximas mensagens.
5.  **Gerenciamento de Memória:** O histórico de cada chat é limitado a **6 mensagens** (incluindo o prompt do sistema) para controlar o consumo de recursos da IA e manter o contexto relevante.

-----

## Configuração e Execução

Para rodar este projeto, você precisa garantir que:

1.  **Dependências instaladas:**
    ```bash
    npm install whatsapp-web.js qrcode-terminal ollama p-queue
    ```
2.  **Servidor Ollama:** O serviço Ollama precisa estar rodando localmente (ou acessível na rede) e o modelo `gemma:7b` deve estar baixado.
3.  **Execução:** Inicie o bot no diretório do projeto:
    ```bash
    node main.js
    ```
    Ao iniciar, um QR Code será exibido no terminal. Use o aplicativo WhatsApp do seu telefone para escanear e logar o bot.