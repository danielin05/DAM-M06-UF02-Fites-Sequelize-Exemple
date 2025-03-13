/**
 * ComentariController.js
 * Controlador per gestionar les operacions relacionades amb els Comentaris
 */

const { VideoComentaris, Comentari } = require('../models');
const { logger } = require('../config/logger');

/**
 * Obté un Comentari per ID
 * @param {Object} req - Objecte de petició
 * @param {Object} res - Objecte de resposta
 * @param {Function} next - Funció següent del middleware
 */
const obtenirPerId = async (req, res, next) => {
    try {
      const { id } = req.params.id;
      const user_id = req.params.user_id;
      logger.info(`Petició per obtenir comentari amb ID: ${id}`);
      

      const comentari = await Comentari.findAll({
        include: [
            {
              model: Video,
              attributes: ['id', 'titol', 'url_video'],
              include: [
                {
                    model: Youtuber,
                    attributes: ['nom_canal']
                }
              ]
            }
          ],
        where: { user_id: user_id }
      });
      
      if (!comentari) {
        return res.status(404).json({
          ok: false,
          missatge: `No s'ha trobat cap Comentari amb l'ID: ${id}`
        });
      }
      
      res.status(200).json({
        ok: true,
        missatge: 'Comentari obtingut amb èxit',
        resultat: comentari
      });
    } catch (error) {
      logger.error(`Error obtenint comentari amb ID ${req.params.id}:`, error);
      next(error);
    }
  };

  module.exports = {
    obtenirPerId,
  };