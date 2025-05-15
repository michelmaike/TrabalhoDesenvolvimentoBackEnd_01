const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.BANCO_DADOS);
mongoose.connection.on('error', (erro) => console.log('Erro de conexão com o MongoDB:', erro));
mongoose.connection.on('connected', () => console.log('Conectado ao MongoDB com sucesso!'));

const servidor = express();
servidor.use(cors());
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

const rotas = require('./src/routes/Router');
servidor.use('/', rotas);

const PORTA = process.env.PORTA || 4000;
servidor.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));