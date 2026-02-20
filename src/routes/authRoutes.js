const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuariocontroller');

router.post('/login', UsuarioController.login);

module.exports = router;