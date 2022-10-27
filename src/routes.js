const express = require('express');
const app = express();

app.use(require('./controllers/bot-login.controller'));

module.exports = app;