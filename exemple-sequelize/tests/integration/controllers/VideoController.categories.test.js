// tests/unit/controllers/VideoController.categories.test.js
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

describe('VideoController - Categorías', () => {
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

  describe('crearVideo con categorías', () => {
    it('debería crear un vídeo sin categorías cuando no se proporcionan', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1
        // Sin categorías
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
      
      // Simular éxito al buscar el vídeo completo
      Video.findByPk.mockResolvedValue({
        ...mockVideo,
        Youtuber: { nom_canal: 'Canal Test' },
        Categories: []
      });
      
      await VideoController.crearVideo(req, res, next);
      
      // Verificaciones
      expect(mockVideo.setCategories).not.toHaveBeenCalled(); // No se llama a setCategories
      expect(Categoria.findAll).not.toHaveBeenCalled(); // No se buscan categorías
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
    
    it('debería crear un vídeo con categorías vacías', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1,
        categories: [] // Array vacío
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
      
      // Simular éxito al buscar el vídeo completo
      Video.findByPk.mockResolvedValue({
        ...mockVideo,
        Youtuber: { nom_canal: 'Canal Test' },
        Categories: []
      });
      
      await VideoController.crearVideo(req, res, next);
      
      // Verificaciones
      expect(mockVideo.setCategories).not.toHaveBeenCalled(); // No se llama a setCategories con array vacío
      expect(Categoria.findAll).not.toHaveBeenCalled(); // No se buscan categorías
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
    
    it('debería crear un vídeo cuando categorías no es un array', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1,
        categories: "1,2,3" // No es un array
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
      
      // Simular éxito al buscar el vídeo completo
      Video.findByPk.mockResolvedValue({
        ...mockVideo,
        Youtuber: { nom_canal: 'Canal Test' },
        Categories: []
      });
      
      await VideoController.crearVideo(req, res, next);
      
      // Verificaciones
      expect(mockVideo.setCategories).not.toHaveBeenCalled(); // No se llama a setCategories
      expect(Categoria.findAll).not.toHaveBeenCalled(); // No se buscan categorías
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
    
    it('debería gestionar categorías parcialmente encontradas', async () => {
      req.body = {
        titol: 'Vídeo Test',
        descripcio: 'Descripción de prueba',
        url_video: 'https://example.com/video',
        youtuber_id: 1,
        categories: [1, 2, 3] // Solicita 3 categorías
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
      
      // Simular que solo se encuentran 2 de 3 categorías
      const foundCategories = [
        { id: 1, titol: 'Categoria 1' },
        { id: 2, titol: 'Categoria 2' }
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
      expect(Categoria.findAll).toHaveBeenCalledWith({ where: { id: [1, 2, 3] } });
      expect(logger.warn).toHaveBeenCalledWith('Algunes categories no existeixen', expect.any(Object));
      expect(mockVideo.setCategories).toHaveBeenCalledWith(foundCategories);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });
  });
});