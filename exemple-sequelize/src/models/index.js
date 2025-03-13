/**
 * index.js de models
 * Configuració de les relacions entre els models
 */

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const Youtuber = require('./Youtuber');
const PerfilYoutuber = require('./PerfilYoutuber');
const Video = require('./Video');
const Categoria = require('./Categoria');
const Usuari = require('./Usuari')
const Comentari = require('./Comentari')
const Valoracio = require('./Valoracio')

// Definir el model VideosCategories que servirà com a taula d'unió
const VideosCategories = sequelize.define('VideosCategories', {
  video_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Video,
      key: 'id'
    }
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Categoria,
      key: 'id'
    }
  }
}, {
  tableName: 'videos_categories',
  timestamps: false
});

// Definir el model VideosComentaris que servirà com a taula d'unió
const VideoComentaris = sequelize.define('VideosComentaris', {
  id: {
    type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
  },
  video_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Video,
      key: 'id'
    }
  },
  comentari_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Comentari,
      key: 'id'
    }
  },
  usuari_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuari,
      key: 'id'
    }
  }
}, {
  tableName: 'videos_comentaris',
  timestamps: false
});

// Definir el model VideosValoracions que servirà com a taula d'unió
const VideoValoracions = sequelize.define('VideosValoracions', {
  id: {
    type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  video_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Video,
      key: 'id'
    }
  },
  valoracio_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Valoracio,
      key: 'id'
    }
  },
  usuari_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuari,
      key: 'id'
    }
  }
}, {
  tableName: 'videos_valoracions',
  timestamps: false
});

// Relació 1:1 entre Youtuber i PerfilYoutuber
Youtuber.hasOne(PerfilYoutuber, { foreignKey: 'youtuber_id' });
PerfilYoutuber.belongsTo(Youtuber, { foreignKey: 'youtuber_id' });

// Relació 1:N entre Youtuber i Video
Youtuber.hasMany(Video, { foreignKey: 'youtuber_id' });
Video.belongsTo(Youtuber, { foreignKey: 'youtuber_id' });

// Relació N:M entre Video i Categoria
Video.belongsToMany(Categoria, { through: VideosCategories, foreignKey: 'video_id' });
Categoria.belongsToMany(Video, { through: VideosCategories, foreignKey: 'categoria_id' });

//Relació 1:N entre Video i Comentari
Video.belongsToMany(Comentari, { through: VideoComentaris, foreignKey: 'video_id' });
Comentari.belongsToMany(Video, { through: VideoComentaris, foreignKey: 'comentari_id' });
Usuari.belongsToMany(Comentari, { through: VideoComentaris, foreignKey: 'usuari_id' });

//Relació 1:N entre Video i Valoracio
Video.belongsToMany(Valoracio, { through: VideoValoracions, foreignKey: 'video_id' });
Valoracio.belongsToMany(Video, { through: VideoValoracions, foreignKey: 'valoracio_id' });
Usuari.belongsToMany(Valoracio, { through: VideoValoracions, foreignKey: 'usuari_id' });

module.exports = {
  Youtuber,
  PerfilYoutuber,
  Video,
  Categoria,
  VideosCategories,
  Usuari,
  Comentari,
  Valoracio,
  VideoComentaris,
  VideoValoracions
};