const cron = require('node-cron');
const bot = require('../helpers/scraper');

const path = require('path');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client( { authStrategy: new LocalAuth({dataPath: path.join(__dirname, 'wwebjs_auth/')})});

//QR para el authenticated
client.on('qr', qr => { qrcode.generate(qr, {small: true});});

//Evento para determinar si el cliente está listo para recibir y enviar mensajes
client.on('ready', () => { console.log('\x1b[32m%s\x1b[0m','Whatsapp is ready')});

// client.on('message', (message) => {
//     if(message.body === '1') {}
// });

// cron.schedule('0 * * * * *', ()=>{
//     let pass = 'Zurich1502$', user = '25334145J', id = 3
  
//     loginBOTService.getEmpresa( id )
//     .then(paguina => { 
//         bot.listaExp( paguina[0] , user, pass )
//         .then( (listaExp)=> {

//             let message = listaExp.data.length >= 1 ? `!Hay nuevos expedientes ${listaExp.data.join(',')}!` : 'No hay expedientes nuevos';

//             console.log(listaExp.data.join(','))

//             client.sendMessage('573506996058@c.us', message);
//             client.sendMessage('573185690249@c.us', message);
//             return console.log( listaExp.data.length);

//         }).catch((e)=> console.log(e));
//      }).catch((e)=> console.log(e));
// })

// client.initialize();

module.exports = client;