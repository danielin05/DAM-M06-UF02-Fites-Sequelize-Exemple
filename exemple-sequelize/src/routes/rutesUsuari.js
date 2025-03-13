/**
 * rutesUsuari.js
 * Definició de les rutes relacionades amb els usuaris
 */

const express = require('express');
const router = express.Router();
const usuariController = require('../controllers/UsuariController');


/**
 * @swagger
 * /api/usuaris:
 *   post:
 *     summary: Crea un nou Usuari
 *     description: Crea un nou Usuari amb les dades proporcionades
 *     tags: [Usuaris]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username Del usuari
 *               email:
 *                 type: string
 *                 description: Email del usuari
 *               password:
 *                 type: string
 *                 description: Contrasenya del usuari
 *               name:
 *                 type: string
 *                 description: Nom del usuari
 *               data_registre:
 *                 type: string
 *                 format: date
 *                 description: Data de registre del usuari (format ISO)
 *               idioma:
 *                 type: string
 *                 description: Idioma del usuari
 *     responses:
 *       201:
 *         description: Usuari creat amb èxit
 *       400:
 *         description: Les dades proporcionades no compleixen els requisits
 *       404:
 *         description: Ja existeix un usuari amb aquest nom d'usuari o email
 *       500:
 *         description: Error intern del servidor
 */
router.post('/', usuariController.crearUsuari);

module.exports = router;