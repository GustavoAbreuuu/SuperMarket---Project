const express = require('express');
const router = express.Router();
const VendaController = require('../controllers/vendacontroller');

router.get('/', VendaController.index);
router.post('/', VendaController.store);

module.exports = router;