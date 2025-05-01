const mongoose = require('mongoose');

const vooSchema = new mongoose.Schema({
    vooNumero: {
        type: String,
        required: true,
        unique: true
    },
    origin: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    departureDateTime: {
        type: Date,
        required: true
    },
    gateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portao'
    },
    status: {
        type: String,
        enum: ['programado', 'embarque', 'concluido'],
        default: 'programado'
    }
});

module.exports = mongoose.model('Voo', vooSchema);