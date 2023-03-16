const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { EditPhotoHandler } = require('./feature/edit_foto');
const { ChatAIHandler } = require('./feature/chat_ai');
const { ImageAIHandler } = require('./feature/image_ai');
const express = require('express');
const QRCode = require('qrcode')
const fs = require('fs');

const app = express();

/* const client = new Client({
    puppeteer: { headless: true },
  }); */

const client = new Client({
    authStrategy: new LocalAuth()
});

app.use(express.static('public'));

//app.get('/', (req, res) => {
 //   res.sendFile(__dirname + '/index.html');
 //});
  
//   app.get('/qrcode', async (req, res) => {
//     try {
//       const qrCodeData = await client.getQRCode();
//       const qrCodeBase64 = await qrcode.toDataURL(qrCodeData, { scale: 8 });
//       res.send(`<img src="${qrCodeBase64}" alt="QR Code">`);
//     } catch (err) {
//       console.error(err);
//       res.send('Error generating QR code');
//     }
//   });
  
// Define a route to display the QR code image

// app.get('/qrcode', function(req, res) {  
// client.on('qr', (qr) => {

//     var code = qr.image(qr, { type: 'svg' });
//     res.type('svg');
//     code.pipe(res);
//    // res.send(qrCodeData);

// });
//   });



// app.get('/', async (req, res) => {


//    // var img = "https://va.bankjogja.com/Images/logo.png";
//     res.send('<h2>QRCode Generated</h2><div><img src="http://localhost:3000/qrcodes.png"/></div>')


// });

client.on('qr', (qr) => {
    QRCode.toFile('public/qrcode.png', qr, {
        errorCorrectionLevel: 'H',
        type: 'png',
        quality: 1,
        margin: 1
      }, (err) => {
        if (err) throw err;
        console.log('QR code saved as qrcode.png');
      }); 
 
});

// Start the server
app.listen(80, () => {
  console.log('Server listening on port 3000');
});

 
client.on('ready', () => {
    console.log('Client is ready!');
});

//   client.on('qr', async (qr) => {
//     try {
//       const qrCodeData = await client.generateQR(qr);
//       const qrCodeBase64 = qrCodeData.replace(/^data:image\/(png|jpg);base64,/, '');
//       io.emit('qrcode', qrCodeBase64);
//     } catch (err) {
//       console.error(err);
//     }
//   });

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


 
// const qrcodeUrl = 'http://localhost:3000/qrcode';
// require('open')(qrcodeUrl);



