// tests/setup.js
const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

// Mock de la base de dades ABANS d'importar-la
jest.mock('../src/config/database', () => {
  const { Sequelize } = require('sequelize');
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
  return { sequelize };
});

// Importar l'instància mockejada i els models
const { sequelize } = require('../src/config/database');
const Youtuber = require('../src/models/Youtuber');
const PerfilYoutuber = require('../src/models/PerfilYoutuber');
const Video = require('../src/models/Video');
const Categoria = require('../src/models/Categoria');

// Configurar les associacions entre models (important per a tests!)
Youtuber.hasOne(PerfilYoutuber, { foreignKey: 'youtuber_id' });
PerfilYoutuber.belongsTo(Youtuber, { foreignKey: 'youtuber_id' });

Youtuber.hasMany(Video, { foreignKey: 'youtuber_id' });
Video.belongsTo(Youtuber, { foreignKey: 'youtuber_id' });

// Definir model de la taula intermèdia
const VideosCategories = sequelize.define('VideosCategories', {
  video_id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    references: { model: Video, key: 'id' }
  },
  categoria_id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    references: { model: Categoria, key: 'id' }
  }
}, {
  tableName: 'videos_categories',
  timestamps: false
});

// Relació N:M entre Video i Categoria
Video.belongsToMany(Categoria, { through: VideosCategories, foreignKey: 'video_id' });
Categoria.belongsToMany(Video, { through: VideosCategories, foreignKey: 'categoria_id' });

// Mock del server per evitar que s'iniciï automàticament
jest.mock('../server', () => {
  const express = require('express');
  const app = express();
  
  // Mock del mètode listen per evitar que s'iniciï el servidor
  app.listen = jest.fn(() => ({ close: jest.fn() }));
  
  return app;
});

// Desactivar logs durant els tests
jest.mock('../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  expressLogger: jest.fn((req, res, next) => next()),
}));

// Configuració per tots els tests
beforeAll(async () => {
  // Inicialitzar els models i la base de dades en memòria
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.log('Info: Error al tancar la base de dades, pot ser que ja estigui tancada');
  }
});

// Configuració global de Jest
jest.setTimeout(30000); // 30 segons

// Exportar l'instància per utilitzar-la en altres tests
module.exports = { sequelize, Youtuber, Video, Categoria, PerfilYoutuber, VideosCategories };
