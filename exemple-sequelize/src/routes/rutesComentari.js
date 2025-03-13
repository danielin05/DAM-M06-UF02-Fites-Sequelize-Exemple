/**
 * rutesUsuari.js
 * Definició de les rutes relacionades amb els usuaris
 */

const express = require('express');
const router = express.Router();
const comentariController = require('../controllers/ComentariController');

router.get('/{id_usuari}', comentariController.obtenirPerId);


module.exports = router;