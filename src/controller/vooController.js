const Voo = require('../models/Voo');
const Portao = require('../models/Portao');
const Passageiro = require('../models/Passageiro');
const { validationResult } = require('express-validator');

module.exports = {
  criar: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array()[0].msg });
    }

    const { numeroVoo, origem, destino, dataHoraPartida, portaoId } = req.body;

    const vooExistente = await Voo.findOne({ numeroVoo });
    if (vooExistente) {
      return res.status(400).json({ erro: 'Número de voo já cadastrado' });
    }

    let portao = null;
    if (portaoId) {
      portao = await Portao.findById(portaoId);
      if (!portao) {
        return res.status(404).json({ erro: 'Portão não encontrado' });
      }
      if (!portao.disponivel) {
        return res.status(400).json({ erro: 'Portão ocupado' });
      }
      portao.disponivel = false;
      await portao.save();
    }

    const novoVoo = new Voo({
      numeroVoo,
      origem,
      destino,
      dataHoraPartida,
      portaoId: portaoId || null,
      status: 'programado',
    });

    await novoVoo.save();
    res.json({ voo: novoVoo });
  },

  listar: async (req, res) => {
    const voos = await Voo.find().populate('portaoId');
    res.json({ voos });
  },

  atualizarStatus: async (req, res) => {
    const { id } = req.params;

    // Verifica se req.body existe e contém status
    if (!req.body || !req.body.status) {
      return res.status(400).json({ erro: 'O campo status é obrigatório no body da requisição' });
    }

    const { status } = req.body;

    if (!['programado', 'embarque', 'concluido'].includes(status)) {
      return res.status(400).json({ erro: 'status invalido' });
    }

    const voo = await Voo.findById(id).populate('portaoId');
    if (!voo) {
      return res.status(404).json({ erro: 'o voo não foi encontrado' });
    }

    if (status === 'concluido' && voo.portaoId) {
      const portao = await Portao.findById(voo.portaoId);
      portao.disponivel = true;
      await portao.save();
    }

    voo.status = status;
    await voo.save();
    res.json({ voo });
  },

  relatorioDiario: async (req, res) => {
    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);
    const fimDia = new Date();
    fimDia.setHours(23, 59, 59, 999);

    const voos = await Voo.find({
      dataHoraPartida: { $gte: inicioDia, $lte: fimDia },
    }).populate('portaoId');

    const relatorio = [];
    for (const voo of voos) {
      const passageiros = await Passageiro.find({ vooId: voo._id });
      relatorio.push({
        numeroVoo: voo.numeroVoo,
        origem: voo.origem,
        destino: voo.destino,
        dataHoraPartida: voo.dataHoraPartida,
        portao: voo.portaoId ? voo.portaoId.codigo : 'não atribuido',
        status: voo.status,
        passageiros: passageiros.map(p => ({
          nome: p.nome,
          cpf: p.cpf,
          statusCheckIn: p.statusCheckIn,
        })),
      });
    }

    res.json({ relatorio });
  },

  excluir: async (req, res) => {
    const { id } = req.params;
    const voo = await Voo.findById(id).populate('portaoId');
    if (!voo) {
      return res.status(404).json({ erro: 'o voo não foi encontrado' });
    }
    if (voo.portaoId) {
      const portao = await Portao.findById(voo.portaoId);
      portao.disponivel = true;
      await portao.save();
    }
    await Voo.findByIdAndDelete(id);
    res.json({ mensagem: 'voo excluido' });
  },
};