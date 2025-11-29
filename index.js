const { Client, RemoteAuth } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const express = require('express');
const cohere = require('cohere-ai');
const fs = require('fs');

// ⚡ Clé Cohere directe
cohere.init('TfsbCLHIdEHvncALH9sY2KVWN3IeLeenfGD7jeW0F');

const sessionFilePath = '/mnt/storage/session.json';
const qrImagePath = '/mnt/storage/whatsapp-qr.png';

const client = new Client({
    authStrategy: new RemoteAuth({
        clientId: 'mon-bot',
        dataPath: sessionFilePath,
        backupSyncIntervalMs: 0 // sauvegarde manuelle seulement
    })
});

// Express pour rendre le QR code public
const app = express();
const port = process.env.PORT || 3000;
app.use('/qr', express.static(qrImagePath));
app.listen(port, () => console.log(`QR code public : https://<ton-projet-railway>.up.railway.app/qr`));

client.on('qr', async qr => {
    await QRCode.toFile(qrImagePath, qr);
    console.log('QR code généré ! Ouvre /qr pour scanner avec ton téléphone.');
});

client.on('ready', async () => {
    console.log('Bot prêt !');
    await client.authStrategy.saveCreds();
    console.log('Session sauvegardée sur Persistent Storage !');
});

client.on('message', async message => {
    console.log(`Message reçu : ${message.body}`);

    try {
        // Génération via Commando
        const response = await cohere.generate({
            model: 'command', // 🔥 Commando ici
            prompt: `Réponds de manière courte et amicale à ce message : "${message.body}"`,
            max_tokens: 50
        });

        const reply = response.body.generations[0].text.trim();
        await message.reply(reply);
    } catch (err) {
        console.error('Erreur Cohere :', err);
        await message.reply('Désolé, je n’ai pas pu répondre 😅');
    }
});

client.initialize();
