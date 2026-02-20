const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/produtocontroller');

router.get('/', ProdutoController.index);
router.post('/', ProdutoController.store);
router.get('/codigo/:codigo', ProdutoController.getByCodigo);
router.get('/:id', ProdutoController.show);
router.put('/:id', ProdutoController.update);
router.delete('/:id', ProdutoController.destroy);

module.exports = router;