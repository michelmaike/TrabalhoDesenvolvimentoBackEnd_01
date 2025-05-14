const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: 'variables.env' }); // corrigido

mongoose.connect(process.env.BANCO_DADOS);
mongoose.connection.on('erro', (erro) => console.log('Erro de conexão com o MongoDB:', erro));
mongoose.connection.on('conectado', () => console.log('Conectado ao MongoDB com sucesso!'));

const servidor = express();
servidor.use(cors());
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true })); // corrigido

const rotas = require('./src/routes/Router');// corrigido
servidor.use('/', rotas);

const PORTA = process.env.PORTA || 4000;
servidor.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}`));
