const express = require('express');
const router = express.Router();
const FornecedorController = require('../controllers/fornecedorcontroller');

router.get('/', FornecedorController.index);
router.post('/', FornecedorController.store);
router.get('/:id', FornecedorController.show);
router.put('/:id', FornecedorController.update);
router.delete('/:id', FornecedorController.destroy);

module.exports = router;