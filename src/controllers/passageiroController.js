const Passageiro = require('../models/Passageiro');
const Voo = require('../models/Voo');
const { validationResult, matchedData } = require('express-validator');

module.exports = {
    //Criar passageiro
    create: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.mapped() });

        try {
            const data = matchedData(req);
            const novoPassageiro = await Passageiro.create(data);
            res.status(201).json(novoPassageiro);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar passageiro' });
        }
    },

    //Atualizar check-in
    checkIn: async (req, res) => {
        const { id } = req.params;

        try {
            const passageiro = await Passageiro.findById(id).populate('vooId');
            if (!passageiro) {
                return res.status(404).json({ error: 'Passageiro não encontrado' });
            }

            const voo = await Voo.findById(passageiro.vooId);
            if (!voo) {
                return res.status(404).json({ error: 'Voo não encontrado' });
            }

            if (voo.status !== 'embarque') {
                return res.status(400).json({
                    error: 'Check-in so permitido durante o status embarque'
                });
            }

            passageiro.checkInStatus = 'realizado';
            await passageiro.save();
            res.json(passageiro);
        } catch (error) {
            res.status(500).json({ error: 'Erro no check-in' });
        }
    },

    // Listar passageiros
    list: async (req, res) => {
        try {
            const passageiros = await Passageiro.find().populate('vooId'); 
            res.json(passageiros);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar passageiros' });
        }
    }
};