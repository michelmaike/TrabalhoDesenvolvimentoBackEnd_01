const { checkSchema } = require('express-validator');

module.exports = {
  criar: checkSchema({
    nome: {
      notEmpty: true,
      errorMessage: 'nome é obrigatório',
    },
    email: {
      notEmpty: true,
      isEmail: true,
      errorMessage: 'email válido é obrigatório',
    },
    senha: {
      notEmpty: true,
      isLength: { options: { min: 6 } },
      errorMessage: 'senha deve ter no mínimo 6 caracteres',
    },
    cargo: {
      notEmpty: true,
      errorMessage: 'cargo é obrigatório',
    },
  }),
  login: checkSchema({
    email: {
      notEmpty: true,
      isEmail: true,
      errorMessage: 'email valido é obrigatório',
    },
    senha: {
      notEmpty: true,
      errorMessage: 'senha é obrigatória',
    },
  }),
};