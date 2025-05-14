const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modeloSchema = new mongoose.Schema({
  nome: String,
  cpf: String,
  vooId: { type: mongoose.Schema.Types.ObjectId, ref: 'Voo' },
  statusCheckIn: String,
});

const nomeModelo = 'Passageiro';

if (mongoose.connection && mongoose.connection.models[nomeModelo]) {
  module.exports = mongoose.connection.models[nomeModelo];
} else {
  module.exports = mongoose.model(nomeModelo, modeloSchema);
}