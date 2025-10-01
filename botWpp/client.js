import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;

import qrcode from 'qrcode-terminal';

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: 'salvar'
    })
});

client.on('ready', () => {
    console.log('Tudo certo! Bot funcionando.');
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.initialize();

export default client;
