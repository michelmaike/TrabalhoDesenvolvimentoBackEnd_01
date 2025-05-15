const Funcionario = require('../models/Funcionario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

module.exports = {
  criar: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array()[0].msg });
    }

    const { nome, email, senha, cargo } = req.body;

    const emailExistente = await Funcionario.findOne({ email });
    if (emailExistente) {
      return res.status(400).json({ erro: 'email ja cadastrado' });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoFuncionario = new Funcionario({
      nome,
      email,
      senha: senhaCriptografada,
      cargo,
    });

    await novoFuncionario.save();
    res.status(201).json({ mensagem: 'funcionario cadastrado com sucesso' });
  },

  login: async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erro: erros.array()[0].msg });
    }

    const { email, senha } = req.body;

    const funcionario = await Funcionario.findOne({ email });
    if (!funcionario) {
      return res.status(400).json({ erro: 'email ou senha invalidos' });
    }

    const senhaValida = await bcrypt.compare(senha, funcionario.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: 'email ou senha invalidos' });
    }

    const token = jwt.sign(
      { id: funcionario._id, nome: funcionario.nome, cargo: funcionario.cargo },
      process.env.JWT_SECRET,
      {expiresIn: '1h' }
    );

    res.json({ token });
  },
};