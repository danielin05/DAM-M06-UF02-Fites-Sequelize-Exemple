/**
 * YoutuberController.js
 * Controlador per gestionar les operacions relacionades amb els youtubers
 */

const { Usuari} = require('../models');
const { logger } = require('../config/logger');

/**
 * Crea un nou vídeo
 * @param {Object} req - Objecte de petició
 * @param {Object} res - Objecte de resposta
 * @param {Function} next - Funció següent del middleware
 */
const crearUsuari = async (req, res, next) => {
    try {
      const { username, email, password, name, idioma} = req.body;
      logger.info('Petició per crear un nou Usuari', { username, email, password });
      
        if(username.length() < 3){
            res.status(400).json({
                ok: false,
                codi: "ERROR_VALIDACIO",
                missatge: "Les dades proporcionades no compleixen els requisits",
                detalls: [
                {
                    camp: "username",
                    error: "El name d'usuari ha de tenir com a mínim 3 caràcters"
                }
                ]}
              )
        }

        // Verificar que el usuari existeix
        const usuari = await Usuari.findOne(username);
        if (usuari) {
            return res.status(409).json({
                ok: false,
                codi: "ERROR_DUPLICAT",
                missatge: "Ja existeix un usuari amb aquest nom d'usuari o email",
                detalls: [
                {
                    camp: "username",
                    error: "Aquest username ja està registrat"
                }
                ]}
            );
        }

        // Verificar que el usuari existeix
        usuari = await Usuari.findOne(email);
        if (usuari) {
            return res.status(409).json({
                ok: false,
                codi: "ERROR_DUPLICAT",
                missatge: "Ja existeix un usuari amb aquest nom d'usuari o email",
                detalls: [
                {
                    camp: "email",
                    error: "Aquest email ja està registrat"
                }
                ]}
            );
        }
      
      // Crear el Usuari
      usuari = await Usuari.create({
        username,
        email,
        password,
        name,
        data_registre: new Date(Date.now()).toISOString(),
        idioma
      });

    res.status(201).json({
        ok: true,
        missatge: "Usuari creat amb èxit",
        resultat: {
            id: req.body.id,
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            data_registre: req.body.data_registre,
            idioma: req.body.idioma
        }
    });
    } catch (error) {
      logger.error('Error creant nou Usuari:', error);
      next(error);
    }
  };

module.exports = {
    crearUsuari
};