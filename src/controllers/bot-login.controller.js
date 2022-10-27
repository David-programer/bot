const express = require('express');
const router = express.Router();
const bot = require('../helpers/scraper');
const xml = require('../helpers/generarXML');
const {bot_config} = require('../database/config.bot');

// routes
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/lista_nuevos_expedientes', getList);
router.get('/descarga_expediente', getExp);

// route functions
function getExp(req, res, next) {
    const { id, pass, user, exp } = req.query;
    const paguina = bot_config[id];

    bot.XMLexp( paguina, user, pass, exp )
    .then((arrayExp)=> {
        xml.xml( arrayExp, paguina[0] )
        .then( (response )=> {
                return res.send(response );
            }
        ).catch(next);
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

module.exports = router;