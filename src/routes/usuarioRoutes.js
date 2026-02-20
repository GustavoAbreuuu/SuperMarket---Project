const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuariocontroller');

router.get('/', UsuarioController.index);
router.post('/', UsuarioController.store);
router.get('/:id', UsuarioController.show);
router.put('/:id', UsuarioController.update);
router.delete('/:id', UsuarioController.destroy);

module.exports = router;