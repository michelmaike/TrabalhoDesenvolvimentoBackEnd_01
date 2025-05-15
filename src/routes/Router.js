const express = require('express');
const router = express.Router();

const passageiroController = require('../controller/passageiroController');
const vooController = require('../controller/vooController');
const portaoController = require('../controller/portaoController');
const funcionarioController = require('../controller/funcionarioController');
const passageiroValidator = require('../validator/passageiroValidator');
const vooValidator = require('../validator/vooValidator');
const portaoValidator = require('../validator/portaoValidator');
const funcionarioValidator = require('../validator/funcionarioValidator');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/ping', (req, res) => {
  res.json({ retorno: true });
});

router.post('/passageiros', passageiroValidator.criar, passageiroController.criar);
router.put('/passageiros/:id/checkin', passageiroController.fazerCheckIn);
router.get('/passageiros', passageiroController.listar);
router.delete('/passageiros/:id', passageiroController.excluir);

router.post('/voos', vooValidator.criar, authMiddleware, adminMiddleware, vooController.criar);
router.put('/voos/:id/status', authMiddleware, adminMiddleware, vooController.atualizarStatus);
router.get('/voos', vooController.listar);
router.delete('/voos/:id', vooController.excluir);

router.post('/portoes', portaoValidator.criar, portaoController.criar);
router.get('/portoes', portaoController.listar);
router.put('/portoes/:id/disponibilidade', portaoController.atualizarDisponibilidade);
router.delete('/portoes/:id', portaoController.excluir);

router.get('/relatorios/diario', vooController.relatorioDiario);

router.post('/funcionarios', funcionarioValidator.criar, funcionarioController.criar);
router.post('/login', funcionarioValidator.login, funcionarioController.login);

module.exports = router;