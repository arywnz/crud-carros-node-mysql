const express = require('express');
const path = require('path');

const routes = require('./routes');
const logger = require('./middlewares/logger');

const app = express();

// Middleware para JSON
app.use(express.json());

// Middleware global (log)
app.use(logger);

// Arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rotas
app.use(routes);

module.exports = app;