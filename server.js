const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => {
    console.error("Erro de conexão com o MongoDB:", error.message);
});
mongoose.connection.on('connected', () => {
    console.log("Conectado ao MongoDB com sucesso!");
});

const server = express();
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

const airportRoutes = require('./src/routes/aeroportoRoutes');
server.use('/', airportRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});