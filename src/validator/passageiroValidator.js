const { checkSchema } = require('express-validator');

module.exports = {
  criar: checkSchema({
    nome: {
      notEmpty: true,
      errorMessage: 'Nome é obrigatório',
    },
    cpf: {
      notEmpty: true,
      isLength: {
        options: { min: 11, max: 11 },
      },
      isNumeric: true,
      errorMessage: 'CPF deve ter exatamente 11 dígitos numéricos',
    },
    vooId: {
      notEmpty: true,
      errorMessage: 'Voo é obrigatório',
    },
  }),
};