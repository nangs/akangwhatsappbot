const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./feature/edit_foto');
const { ChatAIHandler } = require('./feature/chat_ai');
const { ImageAIHandler } = require('./feature/image_ai');
const QRCode = require('qrcode')


const client = new Client({
    authStrategy: new LocalAuth()
});


client.on('qr', (qr) => {
    QRCode.toFile('qrcode.png', qr, {
        errorCorrectionLevel: 'H',
        type: 'png',
        quality: 1,
        margin: 1
      }, (err) => {
        if (err) throw err;
        console.log('QR code saved as qrcode.png');
      }); 
 
});

 
client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {

    const text = msg.body.toLowerCase() || '';

    //check status
    if (text === '!ping') {
        msg.reply('pong');
    }

    // #edit_bg/bg_color
    if (text.includes("#edit_bg/")) {
        await EditPhotoHandler(text, msg);
    }
    // #ask/question?
    if (text.includes("kang.")) {
        await ChatAIHandler(text, msg);
    }
	//image/question?
	if (text.includes("img.")) {
        await ImageAIHandler(text, msg);
    }

});

client.initialize();

