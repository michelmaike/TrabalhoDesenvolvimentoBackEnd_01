const express = require('express');
const router = express.Router();

const passageiroController = require('../controller/passageiroController');
const vooController = require('../controller/vooController');
const portaoController = require('../controller/portaoController');

const passageiroValidator = require('../validator/passageiroValidator');
const vooValidator = require('../validator/vooValidator');
const portaoValidator = require('../validator/portaoValidator');

router.get('/ping', (req, res) => {
  res.json({ retorno: true });
});

router.post('/passageiros', passageiroValidator.criar, passageiroController.criar);
router.put('/passageiros/:id/checkin', passageiroController.fazerCheckIn);
router.get('/passageiros', passageiroController.listar);
router.delete('/passageiros/:id', passageiroController.excluir);

router.post('/voos', vooValidator.criar, vooController.criar);
router.put('/voos/:id/status', vooController.atualizarStatus);
router.get('/voos', vooController.listar);
router.delete('/voos/:id', vooController.excluir);

router.post('/portoes', portaoValidator.criar, portaoController.criar);
router.get('/portoes', portaoController.listar);
router.put('/portoes/:id/disponibilidade', portaoController.atualizarDisponibilidade);
router.delete('/portoes/:id', portaoController.excluir);

router.get('/relatorios/diario', vooController.relatorioDiario);

module.exports = router;