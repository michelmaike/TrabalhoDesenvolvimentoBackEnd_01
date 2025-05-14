const { checkSchema } = require('express-validator');

module.exports = {
  criar: checkSchema({
    codigo: {
      notEmpty: true,
      errorMessage: 'o código é obrigatório',
    },
  }),
};