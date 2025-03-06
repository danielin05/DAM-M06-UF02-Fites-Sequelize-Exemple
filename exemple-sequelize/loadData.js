/**
 * Script per carregar dades CSV a la base de dades
 * 
 * Aquest script llegeix els arxius CSV i carrega les dades a la base de dades utilitzant Sequelize
 * Executa amb: node loadData.js
 */

require('dotenv').config();
console.log("Ruta BD:", process.env.DB_PATH); // Per verificar que s'ha carregat

const fs = require('fs').promises;
const path = require('path');
const Papa = require('papaparse');
const { sequelize } = require('./src/config/database');
const { logger } = require('./src/config/logger');

// Importar models
const { Youtuber, PerfilYoutuber, Video, Categoria, VideosCategories } = require('./src/models');

// Rutes als arxius CSV
const BASE_PATH = path.join(__dirname, process.env.DATA_DIR_PATH, 'youtubers_programacio');
const CSV_FILES = {
  YOUTUBERS: path.join(BASE_PATH, 'youtubers.csv'),
  PERFILS: path.join(BASE_PATH, 'youtuber_profiles.csv'),
  CATEGORIES: path.join(BASE_PATH, 'categories.csv'),
  VIDEOS: path.join(BASE_PATH, 'videos.csv'),
  VIDEOS_CATEGORIES: path.join(BASE_PATH, 'video_categories.csv')
};

/**
 * Llegeix i parseja un arxiu CSV
 * @param {string} ruta_fitxer Ruta al fitxer CSV
 * @returns {Promise<Array>} Array amb les dades parseades
 */
async function llegirFitxerCsv(ruta_fitxer) {
  try {
    const contingut_fitxer = await fs.readFile(ruta_fitxer, 'utf8');
    return new Promise((resol, rebutja) => {
      Papa.parse(contingut_fitxer, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: function(resultats) {
          if (resultats.errors.length > 0) {
            logger.warn(`Avisos en parsejar ${ruta_fitxer}:`, resultats.errors);
          }
          resol(resultats.data);
        },
        error: function(error) {
          rebutja(error);
        }
      });
    });
  } catch (error) {
    logger.error(`Error llegint ${ruta_fitxer}:`, error);
    throw error;
  }
}

/**
 * Carrega les dades dels Youtubers
 * @param {Array} youtubers Dades de youtubers
 */
async function carregarYoutubers(youtubers) {
  try {
    logger.info(`Carregant ${youtubers.length} youtubers...`);
    
    for (const youtuber of youtubers) {
      await Youtuber.create({
        id: youtuber.id,
        nom_canal: youtuber.channel_name,
        nom_youtuber: youtuber.youtuber_name,
        descripcio: youtuber.description,
        url_canal: youtuber.channel_url
      });
    }
    
    logger.info("Youtubers carregats correctament");
  } catch (error) {
    logger.error("Error carregant youtubers:", error);
    throw error;
  }
}

/**
 * Carrega els perfils dels Youtubers
 * @param {Array} perfils Dades de perfils
 */
async function carregarPerfils(perfils) {
  try {
    logger.info(`Carregant ${perfils.length} perfils...`);
    
    for (const perfil of perfils) {
      await PerfilYoutuber.create({
        id: perfil.id,
        youtuber_id: perfil.youtuber_id,
        url_twitter: perfil.twitter_url,
        url_instagram: perfil.instagram_url,
        url_web: perfil.website_url,
        informacio_contacte: perfil.contact_info
      });
    }
    
    logger.info("Perfils carregats correctament");
  } catch (error) {
    logger.error("Error carregant perfils:", error);
    throw error;
  }
}

/**
 * Carrega les categories
 * @param {Array} categories Dades de categories
 */
async function carregarCategories(categories) {
  try {
    logger.info(`Carregant ${categories.length} categories...`);
    
    for (const categoria of categories) {
      await Categoria.create({
        id: categoria.id,
        titol: categoria.name,
        descripcio: categoria.description
      });
    }
    
    logger.info("Categories carregades correctament");
  } catch (error) {
    logger.error("Error carregant categories:", error);
    throw error;
  }
}

/**
 * Carrega els vídeos
 * @param {Array} videos Dades de vídeos
 */
async function carregarVideos(videos) {
  try {
    logger.info(`Carregant ${videos.length} vídeos...`);
    
    for (const video of videos) {
      await Video.create({
        id: video.id,
        youtuber_id: video.youtuber_id,
        titol: video.title,
        descripcio: video.description,
        url_video: video.video_url,
        data_publicacio: video.publication_date,
        visualitzacions: video.views,
        likes: video.likes
      });
    }
    
    logger.info("Vídeos carregats correctament");
  } catch (error) {
    logger.error("Error carregant vídeos:", error);
    throw error;
  }
}

/**
 * Carrega les relacions entre vídeos i categories
 * @param {Array} videos_categories Dades de relacions
 */
async function carregarVideosCategories(videos_categories) {
  try {
    logger.info(`Carregant ${videos_categories.length} relacions de vídeo-categoria...`);
    
    for (const relacio of videos_categories) {
      await VideosCategories.create({
        video_id: relacio.video_id,
        categoria_id: relacio.category_id
      });
    }
    
    logger.info("Relacions vídeo-categoria carregades correctament");
  } catch (error) {
    logger.error("Error carregant relacions vídeo-categoria:", error);
    throw error;
  }
}

/**
 * Funció principal que coordina tot el procés de càrrega
 */
async function carregarTotesDades() {
  try {
    logger.info("Iniciant càrrega de dades...");
    
    // Sincronitzar models amb la base de dades
    await sequelize.authenticate();
    logger.info("Connexió a la base de dades establerta");
    
    await sequelize.sync({ force: true });
    logger.info("Taules creades a la base de dades");
    
    // Llegir dades dels arxius CSV
    const youtubers = await llegirFitxerCsv(CSV_FILES.YOUTUBERS);
    const perfils = await llegirFitxerCsv(CSV_FILES.PERFILS);
    const categories = await llegirFitxerCsv(CSV_FILES.CATEGORIES);
    const videos = await llegirFitxerCsv(CSV_FILES.VIDEOS);
    const videos_categories = await llegirFitxerCsv(CSV_FILES.VIDEOS_CATEGORIES);
    
    // Carregar les dades en ordre per respectar dependències
    await carregarYoutubers(youtubers);
    await carregarPerfils(perfils);
    await carregarCategories(categories);
    await carregarVideos(videos);
    await carregarVideosCategories(videos_categories);
    
    logger.info("Totes les dades han estat carregades correctament a la base de dades!");
    
  } catch (error) {
    logger.error("Error durant el procés de càrrega:", error);
  } finally {
    // Tancar connexió a la base de dades quan acabem
    // await sequelize.close();
    // logger.info("Connexió a la base de dades tancada");
  }
}

// Executar el procés de càrrega
carregarTotesDades()
  .then(() => {
    console.log("Procés de càrrega complet");
  })
  .catch(error => {
    console.error("Error en el procés principal:", error);
    process.exit(1);
  });