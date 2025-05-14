const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modeloSchema = new mongoose.Schema({
  numeroVoo: String,
  origem: String,
  destino: String,
  dataHoraPartida: Date,
  portaoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Portao' },
  status: String,
});

const nomeModelo = 'Voo';

if (mongoose.connection && mongoose.connection.models[nomeModelo]) {
  module.exports = mongoose.connection.models[nomeModelo];
} else {
  module.exports = mongoose.model(nomeModelo, modeloSchema);
}