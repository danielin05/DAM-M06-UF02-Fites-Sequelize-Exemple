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
 *               titol:
 *                 type: string
 *                 description: Títol del vídeo
 *               descripcio:
 *                 type: string
 *                 description: Descripció del vídeo
 *               url_video:
 *                 type: string
 *                 description: URL del vídeo a YouTube
 *               youtuber_id:
 *                 type: integer
 *                 description: ID del youtuber que ha pujat el vídeo
 *               data_publicacio:
 *                 type: string
 *                 format: date
 *                 description: Data de publicació del vídeo (format ISO)
 *               categories:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Array amb els IDs de les categories del vídeo
 *     responses:
 *       201:
 *         description: Vídeo creat amb èxit
 *       400:
 *         description: Dades invàlides
 *       404:
 *         description: Youtuber o categoria no trobada
 *       500:
 *         description: Error intern del servidor
 */
router.post('/', usuariController.crearUsuari);

module.exports = router;