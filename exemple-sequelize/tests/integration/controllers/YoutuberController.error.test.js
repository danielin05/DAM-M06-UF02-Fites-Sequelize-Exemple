// tests/unit/controllers/YoutuberController.error.test.js
const YoutuberController = require('../../../src/controllers/YoutuberController');
const { logger } = require('../../../src/config/logger');

// Mock de los modelos
jest.mock('../../../src/models', () => {
  return {
    Youtuber: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
    },
    PerfilYoutuber: {
      findOne: jest.fn(),
    },
    Video: {
      findAll: jest.fn(),
    }
  };
});

// Mock del logger
jest.mock('../../../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}));

describe('YoutuberController Error Handling', () => {
  let req, res, next;
  const { Youtuber, PerfilYoutuber, Video } = require('../../../src/models');

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('obtenirTots - error handling', () => {
    it('debería gestionar errores de base de datos', async () => {
      // Simular error al buscar todos los youtubers
      const error = new Error('Error de conexión a la base de datos');
      Youtuber.findAll.mockRejectedValue(error);
      
      await YoutuberController.obtenirTots(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenirPerId - error handling', () => {
    it('debería gestionar errores al buscar un youtuber', async () => {
      req.params = { id: 1 };
      
      // Simular error al buscar un youtuber por id
      const error = new Error('Error al consultar la base de datos');
      Youtuber.findByPk.mockRejectedValue(error);
      
      await YoutuberController.obtenirPerId(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenirPerfil - error handling', () => {
    it('debería gestionar errores al buscar el perfil', async () => {
      req.params = { id: 1 };
      
      // Simular error al buscar el perfil
      const error = new Error('Error al obtener el perfil');
      PerfilYoutuber.findOne.mockRejectedValue(error);
      
      await YoutuberController.obtenirPerfil(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenirVideos - error handling', () => {
    it('debería gestionar errores al buscar vídeos del youtuber', async () => {
      req.params = { id: 1 };
      
      // Simular error al buscar si el youtuber existe
      const error = new Error('Error al consultar los vídeos');
      Youtuber.findByPk.mockRejectedValue(error);
      
      await YoutuberController.obtenirVideos(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});