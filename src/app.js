const express = require('express');
const path = require('path');
const routes = require('./routes');
const logger = require('./middlewares/logger');

const app = express();

//Middleware que Intercepta o JSON
app.use(express.json());

//Middleware Global
app.use(logger);

//Arquivos estaticos do frontend
app.use(express.static(path.join(__dirname, '../public')));

//Rotas
app.use(routes);

module.exports = app;