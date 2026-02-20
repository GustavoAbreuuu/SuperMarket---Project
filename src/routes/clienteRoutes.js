const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clientecontroller');

router.get('/', ClienteController.index);
router.post('/', ClienteController.store);
router.get('/:id', ClienteController.show);
router.put('/:id', ClienteController.update);
router.delete('/:id', ClienteController.destroy);

module.exports = router;