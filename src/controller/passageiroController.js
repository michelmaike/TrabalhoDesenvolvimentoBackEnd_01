const Passageiro = require('../models/Passageiro');
const Voo = require('../models/Voo');
const { validationResult } = require('express-validator');

module.exports = {
  criar: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array()[0].msg });
    }

    const { nome, cpf, vooId } = req.body;

    const passageiroExistente = await Passageiro.findOne({ cpf });
    if (passageiroExistente) {
      return res.status(400).json({ erro: 'cpf já esta cadastrado' });
    }

    const voo = await Voo.findById(vooId);
    if (!voo) {
      return res.status(404).json({ erro: 'voo não foi encotrado' });
    }

    const novoPassageiro = new Passageiro({
      nome,
      cpf,
      vooId,
      statusCheckIn: 'pendente',
    });

    await novoPassageiro.save();
    res.json({ passageiro: novoPassageiro });
  },

  fazerCheckIn: async (req, res) => {
    const { id } = req.params;

    const passageiro = await Passageiro.findById(id).populate('vooId');
    if (!passageiro) {
      return res.status(404).json({ erro: 'passageiro não encontrado' });
    }

    if (passageiro.vooId.status !== 'embarque') {
      return res.status(400).json({ erro: 'o checkin só e permitido no embarque' });
    }

    passageiro.statusCheckIn = 'realizado';
    await passageiro.save();
    res.json({ passageiro });
  },

  listar: async (req, res) => {
    const passageiros = await Passageiro.find().populate('vooId');
    res.json({ passageiros });
  },

  excluir: async (req, res) => {
    const { id } = req.params;
    const passageiro = await Passageiro.findByIdAndDelete(id);
    if (!passageiro) {
      return res.status(404).json({ erro: 'passageiro não encontrado' });
    }
    res.json({ mensagem: 'passageiro excluído' });
  },
};