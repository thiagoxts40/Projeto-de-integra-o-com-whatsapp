
-----

# Documentação do Projeto: VPC Tech Chatbot

Este projeto foi desenvolvido como parte do projeto "Viva Sua Profissão" e atua como uma **prova de conceito** de um chatbot assistente. Ele simula a operação da empresa fictícia **VPC Tech**, especializada em manutenção e componentes de computador. O projeto utiliza **IA local (Ollama)** integrada ao **WhatsApp** para demonstrar habilidades em automação, IA e gerenciamento de fluxo de dados.

## Visão Geral e Arquitetura

O sistema é construído sobre a integração de tecnologias.

Tecnologia | Função Principal |
| :--- | :--- |
**`whatsapp-web.js`** | Integração e comunicação com o WhatsApp. 
**`ollama`** | Conexão com o **LLM** (`modelo escolhido`) para gerar as respostas. 
**`PQueue`** | Gerencia o tráfego, limitando a concorrência a 1 requisição Ollama por vez. 
`qrcode-terminal` | Exibe o QR Code para login no WhatsApp no terminal. 
**Node.js** | Ambiente de execução. 

-----

## Estrutura de Arquivos

A organização do projeto é modular, separando a lógica de conexão, a lógica de negócios e outros dados de contexto.

### Estrutura Raiz

| Arquivo/Pasta | Descrição |
| :--- | :--- |
| **`main.js`** | O centro de controle: lógica principal, orquestração e fluxo da conversa. |
| **`client.js`** | Configuração e inicialização do cliente WhatsApp. |
| **`MemoryManager.js`** | Módulo responsável pela persistência e manipulação da memória de chat. |
| **`salvar/`** | **Pasta de Persistência:** Armazena dados (`Auth` do WhatsApp e Logs/Memória). |

### 1\. `client-products/`

Esta pasta define o **contexto de negócio** que é injetado no *prompt* da IA para guiar o comportamento e a precisão das respostas.

| Arquivo | Descrição |
| :--- | :--- |
| **`regrasBot.js`** | Define o papel, tom de voz, limites e regras de formatação do bot. |
| **`agenda.js`** | Fornece a disponibilidade atual para agendamentos de serviços. |
| **`estoque.js`** | Informa o status e a quantidade disponível de componentes. |

### 2\. `MemoryManager.js`

Este **módulo** é responsável pela manipulação de arquivos de memória, garantindo que o contexto das conversas persista, mesmo se houver reinicialização do bot.

  * **`salvar/chatMemory.json`**: Arquivo JSON criado na pasta *salvar* onde o histórico de memória é persistido localmente.
  * **Funcionalidades**: Exporta `load()` e `save()`.

### 3\. `client.js` (Gerenciamento do WhatsApp)

Configura a ponte entre o sistema e o WhatsApp:

  * **Autenticação Persistente**: Usa `LocalAuth` para salvar o login na pasta `salvar/` após o primeiro login.
  * **Eventos**: Gerencia os eventos `qr` (exibição do QR Code) e `ready` (confirmação da conexão).
  * **Exportação**: Exporta a instância configurada do cliente.

### 4\. `main.js` (Lógica e IA)

O centro de controle que orquestra as interações e a memória da conversa.

#### A. Inicialização e Controle de Fluxo

1.  **Persistência da Memória**: O `main.js` importa o **`MemoryManager.js`** e chama **`MemoryManager.load()`** no início da execução.
2.  **Fila Sequencial**: `const queue = new PQueue({ concurrency: 1 });` A concorrência limitada a **1** assegura que o serviço Ollama não seja sobrecarregado.
3.  **Memória de Chat**: O objeto `chatMemory` armazena e recupera o histórico de conversas por usuário (`chatId`) para manter o **contexto**.

#### B. Fluxo da Conversa (`client.on('message_create', ...)`)

1.  **Montagem do Prompt**: `botRules`, `agenda` e `estoque` são convertidos em uma única *string* e injetado no `role: 'system'` do *prompt*.
2.  **Processamento em Fila**: A chamada ao `ollama.chat` é encapsulada em `await queue.add(...)`.
3.  **Atualização e Salvamento**: Após a resposta da IA ser gerada e o histórico ser atualizado, a função **`MemoryManager.save()`** é chamada para persistir os dados.
4.  **Resposta e Feedback**: A resposta da IA é enviada ao usuário.

-----

## Configuração e Execução

Para iniciar o chatbot, siga as etapas abaixo:

1.  **Instalação de Dependências**:

    ```bash
    npm install whatsapp-web.js qrcode-terminal ollama p-queue
    ```

2.  **Serviço Ollama**:

      * Garanta que o serviço **Ollama** esteja em execução.
      * Baixe o modelo de linguagem ex: `ollama pull gemma:7b`.

3.  **Inicialização do Bot**:

    Execute no terminal:

    ```bash
    npm run start
    ```

    O script `start` foi configurado para **salvar logs em `salvar/logs/logBot.txt`** e exibi-los no terminal em tempo real bem complexo (feito com Grok).

    Ao iniciar, use o aplicativo WhatsApp do seu celular para escanear o **QR Code** exibido no terminal e autenticar o bot.