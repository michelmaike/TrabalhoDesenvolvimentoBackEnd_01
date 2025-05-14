const { checkSchema } = require('express-validator');

module.exports = {
  criar: checkSchema({
    numeroVoo: {
      notEmpty: true,
      errorMessage: 'o numero do voo é obrigatório',
    },
    origem: {
      notEmpty: true,
      errorMessage: 'a origem é obrigatoria',
    },
    destino: {
      notEmpty: true,
      errorMessage: 'o destino é obrigatório',
    },
    dataHoraPartida: {
      notEmpty: true,
      errorMessage: 'a data e a hora de partida são obrigatorias',
    },
  }),
};