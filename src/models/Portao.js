const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modeloSchema = new mongoose.Schema({
  codigo: String,
  disponivel: Boolean,
});

const nomeModelo = 'Portao';

if (mongoose.connection && mongoose.connection.models[nomeModelo]) {
  module.exports = mongoose.connection.models[nomeModelo];
} else {
  module.exports = mongoose.model(nomeModelo, modeloSchema);
}