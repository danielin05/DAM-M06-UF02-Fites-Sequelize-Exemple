// tests/unit/controllers/VideoController.error.test.js
const VideoController = require('../../../src/controllers/VideoController');
const { logger } = require('../../../src/config/logger');

// Mock de los modelos
jest.mock('../../../src/models', () => {
  return {
    Video: {
      findAll: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    },
    Youtuber: {
      findByPk: jest.fn(),
    },
    Categoria: {
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

describe('VideoController Error Handling', () => {
  let req, res, next;
  const { Video, Youtuber, Categoria } = require('../../../src/models');

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
      // Simular error al buscar los vídeos
      const error = new Error('Error de conexión a la base de datos');
      Video.findAll.mockRejectedValue(error);
      
      await VideoController.obtenirTots(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenirPerId - error handling', () => {
    it('debería gestionar errores al buscar un vídeo', async () => {
      req.params = { id: 1 };
      
      // Simular error al buscar un vídeo por id
      const error = new Error('Error al consultar la base de datos');
      Video.findByPk.mockRejectedValue(error);
      
      await VideoController.obtenirPerId(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('obtenirCategories - error handling', () => {
    it('debería gestionar errores al buscar categorías', async () => {
      req.params = { id: 1 };
      
      // Simular error al buscar el vídeo
      const error = new Error('Error al obtener categorías');
      Video.findByPk.mockRejectedValue(error);
      
      await VideoController.obtenirCategories(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('crearVideo - error handling', () => {
    it('debería gestionar errores al crear un vídeo', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1,
        categories: [1, 2]
      };
      
      // Simular éxito al buscar el youtuber
      Youtuber.findByPk.mockResolvedValue({ id: 1, nom_canal: 'Canal Test' });
      
      // Simular error al crear el vídeo
      const error = new Error('Error al crear el vídeo');
      Video.create.mockRejectedValue(error);
      
      await VideoController.crearVideo(req, res, next);
      
      // Verificaciones
      expect(logger.error).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });

    it('debería gestionar error cuando algunas categorías no existen', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1,
        categories: [1, 2, 3]
      };
      
      // Simular éxito al buscar el youtuber
      Youtuber.findByPk.mockResolvedValue({ id: 1, nom_canal: 'Canal Test' });
      
      // Simular que el vídeo se crea correctamente
      const mockVideo = {
        id: 1,
        titol: 'Vídeo Test',
        setCategories: jest.fn().mockResolvedValue(true)
      };
      Video.create.mockResolvedValue(mockVideo);
      
      // Simular que solo se encuentran algunas de las categorías solicitadas
      const foundCategories = [
        { id: 1, titol: 'Categoria 1' }
      ];
      Categoria.findAll.mockResolvedValue(foundCategories);
      
      // Simular éxito al buscar el vídeo completo
      Video.findByPk.mockResolvedValue({
        ...mockVideo,
        Youtuber: { nom_canal: 'Canal Test' },
        Categories: foundCategories
      });
      
      await VideoController.crearVideo(req, res, next);
      
      // Verificaciones
      expect(logger.warn).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201); // El vídeo se crea aunque falten categorías
      expect(res.json).toHaveBeenCalled();
    });
  });
});