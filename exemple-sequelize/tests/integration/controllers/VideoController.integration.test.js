// tests/integration/controllers/VideoController.integration.test.js
const { sequelize, Youtuber, Video, Categoria } = require('../../setup');
const VideoController = require('../../../src/controllers/VideoController');

describe('Tests d\'Integració VideoController', () => {
  let req, res, next;
  let createdYoutuber, createdCategories;
  
  beforeAll(async () => {
    // Sincronitzar la base de dades
    await sequelize.sync({ force: true });
    
    // Crear dades de prova
    createdYoutuber = await Youtuber.create({
      nom_canal: 'Canal Test Integració',
      nom_youtuber: 'Tester Integració',
      descripcio: 'Canal per a proves d\'integració',
      url_canal: 'https://youtube.com/integration-test'
    });
    
    createdCategories = await Categoria.bulkCreate([
      {
        titol: 'JavaScript Integració',
        descripcio: 'Categoria JS per a tests d\'integració'
      },
      {
        titol: 'API Integració',
        descripcio: 'Categoria API per a tests d\'integració'
      }
    ]);
  });
  
  beforeEach(() => {
    // Preparar mocks per cada test
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });
  
  describe('obtenirTots', () => {
    it('hauria de retornar tots els vídeos', async () => {
      // Crear alguns vídeos per la prova
      await Video.bulkCreate([
        {
          titol: 'Vídeo Test Integració 1',
          descripcio: 'Descripció del vídeo 1',
          url_video: 'https://youtube.com/integration-test-1',
          youtuber_id: createdYoutuber.id,
          visualitzacions: 1000,
          likes: 100
        },
        {
          titol: 'Vídeo Test Integració 2',
          descripcio: 'Descripció del vídeo 2',
          url_video: 'https://youtube.com/integration-test-2',
          youtuber_id: createdYoutuber.id,
          visualitzacions: 2000,
          likes: 200
        }
      ]);
      
      req = {};
      
      await VideoController.obtenirTots(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(true);
      expect(responseData.resultat.length).toBe(2);
      expect(responseData.resultat[0].titol).toBe('Vídeo Test Integració 1');
      expect(responseData.resultat[0].Youtuber).toBeDefined();
      expect(responseData.resultat[0].Youtuber.nom_canal).toBe('Canal Test Integració');
    });
  });
  
  describe('obtenirPerId', () => {
    let testVideo;
    
    beforeEach(async () => {
      // Crear un vídeo per la prova
      testVideo = await Video.create({
        titol: 'Vídeo Test FindById',
        descripcio: 'Vídeo per provar obtenirPerId',
        url_video: 'https://youtube.com/find-by-id-test',
        youtuber_id: createdYoutuber.id,
        visualitzacions: 500,
        likes: 50
      });
    });
    
    it('hauria de retornar un vídeo per id', async () => {
      req = { params: { id: testVideo.id } };
      
      await VideoController.obtenirPerId(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(true);
      expect(responseData.resultat.id).toBe(testVideo.id);
      expect(responseData.resultat.titol).toBe('Vídeo Test FindById');
      expect(responseData.resultat.Youtuber).toBeDefined();
      expect(responseData.resultat.Youtuber.id).toBe(createdYoutuber.id);
    });
    
    it('hauria de retornar 404 per vídeo inexistent', async () => {
      req = { params: { id: 9999 } };
      
      await VideoController.obtenirPerId(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(false);
      expect(responseData.missatge).toContain('No s\'ha trobat cap vídeo');
    });
  });
  
  describe('obtenirCategories', () => {
    let testVideo;
    
    beforeEach(async () => {
      // Crear un vídeo i assignar-li categories
      testVideo = await Video.create({
        titol: 'Vídeo Test Categories',
        descripcio: 'Vídeo per provar obtenirCategories',
        url_video: 'https://youtube.com/categories-test',
        youtuber_id: createdYoutuber.id,
        visualitzacions: 300,
        likes: 30
      });
      
      // Utilitza Promise.all per afegir categories una per una
      await Promise.all(createdCategories.map(categoria => {
        return testVideo.addCategoria(categoria);
      }));
    });
    
    it('hauria de retornar categories d\'un vídeo', async () => {
      req = { params: { id: testVideo.id } };
      
      await VideoController.obtenirCategories(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(true);
      expect(responseData.resultat.length).toBe(2);
      expect(responseData.resultat[0].titol).toBe('JavaScript Integració');
      expect(responseData.resultat[1].titol).toBe('API Integració');
    });
  });
  
  describe('crearVideo', () => {
    it('hauria de crear un nou vídeo amb categories', async () => {
      req = {
        body: {
          titol: 'Nou Vídeo Test',
          descripcio: 'Vídeo creat mitjançant test d\'integració',
          url_video: 'https://youtube.com/new-integration-test',
          youtuber_id: createdYoutuber.id,
          data_publicacio: new Date().toISOString(),
          categories: createdCategories.map(cat => cat.id)
        }
      };
      
      await VideoController.crearVideo(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(true);
      expect(responseData.resultat.titol).toBe('Nou Vídeo Test');
      expect(responseData.resultat.Categories).toBeDefined();
      expect(responseData.resultat.Categories.length).toBe(2);
      
      // Verificar que el vídeo s'ha guardat a la base de dades
      const savedVideo = await Video.findOne({
        where: { titol: 'Nou Vídeo Test' },
        include: [Categoria]
      });
      
      expect(savedVideo).toBeDefined();
      expect(savedVideo.Categories.length).toBe(2);
    });
    
    it('hauria de retornar 404 si el youtuber no existeix', async () => {
      req = {
        body: {
          titol: 'Vídeo Test Error',
          descripcio: 'Aquest vídeo no hauria de crear-se',
          url_video: 'https://youtube.com/error-test',
          youtuber_id: 9999,
          categories: [1]
        }
      };
      
      await VideoController.crearVideo(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalled();
      
      const responseData = res.json.mock.calls[0][0];
      expect(responseData.ok).toBe(false);
      expect(responseData.missatge).toContain('No s\'ha trobat cap youtuber');
      
      // Verificar que el vídeo no s'ha guardat
      const videoCount = await Video.count({
        where: { titol: 'Vídeo Test Error' }
      });
      
      expect(videoCount).toBe(0);
    });
  });
  
  afterAll(async () => {
    // Netejar la base de dades i tancar la connexió
    await sequelize.sync({ force: true });
  });
});