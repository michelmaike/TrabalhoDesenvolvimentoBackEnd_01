const mongoose = require('mongoose');

const passageiroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cpf: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: v => /^\d{11}$/.test(v),
            message: 'CPF inválido!'
        }
    },
    vooId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voo',
        required: true
    },
    checkInStatus: {
        type: String,
        enum: ['pendente', 'realizado'],
        default: 'pendente'
    }
});

module.exports = mongoose.model('Passageiro', passageiroSchema);