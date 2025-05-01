const express = require('express');
const router = express.Router();
const passageiroController = require('../controllers/passageiroController');
const vooController = require('../controllers/vooController');
const portaoController = require('../controllers/portaoController');
const passageiroValidator = require('../validators/passageiroValidator');

router.post('/passageiros', passageiroValidator.createPassageiro, passageiroController.create);
router.put('/passageiros/:id/checkin', passageiroController.checkIn);
router.get('/passageiros', passageiroController.list);

router.post('/voos', vooController.create);
router.put('/voos/:id/status', vooController.updateStatus);
router.get('/voos', vooController.list);

router.post('/portoes', portaoController.create);
router.get('/portoes', portaoController.list);
router.put('/portoes/:id/disponibilidade', portaoController.updateAvailability);

//Relatorio
router.get('/relatorios/diario', vooController.dailyReport);

module.exports = router;