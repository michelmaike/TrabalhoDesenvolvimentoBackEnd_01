const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modeloSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  cargo: { type: String, required: true },
});

const nomeModelo = 'Funcionario';

if (mongoose.connection && mongoose.connection.models[nomeModelo]) {
  module.exports = mongoose.connection.models[nomeModelo];
} else {
  module.exports = mongoose.model(nomeModelo, modeloSchema);
}