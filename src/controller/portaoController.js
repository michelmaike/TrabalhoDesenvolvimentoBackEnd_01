const Portao = require('../models/Portao');
const { validationResult } = require('express-validator');

module.exports = {
  criar: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array()[0].msg });
    }

    const { codigo } = req.body;

    const portaoExistente = await Portao.findOne({ codigo });
    if (portaoExistente) {
      return res.status(400).json({ erro: 'este codigo ja está cadastrado' });
    }

    const novoPortao = new Portao({
      codigo,
      disponivel: true,
    });

    await novoPortao.save();
    res.json({ portao: novoPortao });
  },

  listar: async (req, res) => {
    const portoes = await Portao.find();
    res.json({ portoes });
  },

  atualizarDisponibilidade: async (req, res) => {
    const { id } = req.params;
    const { disponivel } = req.body;

    const portao = await Portao.findByIdAndUpdate(id, { disponivel }, { new: true });
    if (!portao) {
      return res.status(404).json({ erro: 'portao não encontrado' });
    }
    res.json({ portao });
  },

  excluir: async (req, res) => {
    const { id } = req.params;
    const portao = await Portao.findByIdAndDelete(id);
    if (!portao) {
      return res.status(404).json({ erro: 'portão não encontrado' });
    }
    res.json({ mensagem: 'portão foi excluido' });
  },
};