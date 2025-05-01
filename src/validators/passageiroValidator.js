const { checkSchema } = require('express-validator');
const Passageiro = require('../models/Passageiro');

module.exports = {
    createPassageiro: checkSchema({
        name: {
            notEmpty: true,
            trim: true,
            isLength: { options: { min: 2 } },
            errorMessage: 'Nome precisa ter pelo menos 2 carateres'
        },
        cpf: {
            notEmpty: true,
            custom: {
                options: async (value) => {
                    const exists = await Passageiro.findOne({ cpf: value });
                    if(exists) throw new Error('CPF ja cadastrado');
                    if(!/^\d{11}$/.test(value)) throw new Error('CPF inválido');
                    return true;
                }
            }
        },
        vooId: {
            notEmpty: true,
            errorMessage: 'Voo é obrigatório'
        }
    })
};