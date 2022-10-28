const express = require('express');
const router = express.Router();
const bot = require('../helpers/scraper');
const xml = require('../helpers/generarXML');
const {bot_config} = require('../database/config.bot');

// routes
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/descarga_expediente', getExp);
router.get('/lista_mensajes', getMensajes);
router.get('/subir_mensaje', subirMensajes);
router.get('/lista_nuevos_expedientes', getList);

// route functions
function getExp(req, res, next) {
    const { id, pass, user, siniestro, fecha_enacargo} = req.query;
    const paguina = bot_config[id];
    
    bot.XMLexp( paguina, user, pass, siniestro, fecha_enacargo )
    .then((arrayExp)=> {
        
        if(arrayExp.status != 200) return res.send(arrayExp);
        xml.xml(arrayExp.data).then((response)=>{console.log(response); res.send(response)}).catch(next);

    }).catch(next);
}

function getList(req, res, next) {
    const { id, pass, user } = req.query;
    const paguina = bot_config[id];

    bot.listaExp( paguina , user, pass )
    .then( (listaExp)=> {
        return res.send( listaExp );
    }).catch(next);
}

function getMensajes(req, res, next) {
    const { id, pass, user, siniestro, fecha_encargo } = req.query;
    const paguina = bot_config[id];

    bot.ListaMensajes( paguina , user, pass, siniestro, fecha_encargo)
    .then( (lista_messages)=> {
        return res.send( lista_messages );
    }).catch(next);
}

function subirMensajes(req, res, next) {
    const { id, pass, user, siniestro, text, fecha_encargo, tipo } = req.query;
    const data = bot_config[id];

    bot.SubirMensajes( {data , user, pass, siniestro, fecha_encargo, text, tipo})
    .then( (lista_messages)=> {
        return res.send( lista_messages );
    }).catch(next);
}

module.exports = router;