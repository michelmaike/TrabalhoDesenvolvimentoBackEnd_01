const Portao = require('../models/Portao');

module.exports = {
    create: async (req, res) => {
        const { code } = req.body;
        
        try {
            const novoPortao = await Portao.create({ code });
            res.status(201).json(novoPortao);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar portão' });
        }
    },

    list: async (req, res) => {
        try {
            const portoes = await Portao.find();
            res.json({ portoes });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar portoes' });
        }
    },

    updateAvailability: async (req, res) => {
        const { id } = req.params;
        const { available } = req.body;

        try {
            const portao = await Portao.findByIdAndUpdate(id, { available }, { new: true });
            res.json(portao);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao atualizar portão'});
        }
    }
};