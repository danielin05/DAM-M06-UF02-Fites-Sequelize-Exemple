// tests/e2e/api.test.js
const request = require('supertest');
const app = require('../../server'); // Importar l'app mockejada
const { sequelize, Youtuber, Video, Categoria } = require('../setup');

describe('Tests End-to-End de l\'API', () => {
  // Configurar dades de test
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Crear youtuber de test
    await Youtuber.create({
      id: 1,
      nom_canal: 'Canal Test',
      nom_youtuber: 'Youtuber Test',
      descripcio: 'Descripció de test',
      url_canal: 'https://test.com'
    });
    
    // Crear categories de test
    await Categoria.create({ id: 1, titol: 'JavaScript', descripcio: 'Llenguatge de programació' });
    await Categoria.create({ id: 2, titol: 'Node.js', descripcio: 'Entorn d\'execució' });
    
    // Crear video de test
    const video = await Video.create({
      id: 1,
      titol: 'Video Test',
      descripcio: 'Descripció del video de test',
      url_video: 'https://test.com/video',
      youtuber_id: 1,
      data_publicacio: new Date(),
      visualitzacions: 1000,
      likes: 100
    });
    
    // Obtenir categories creades
    const categories = await Categoria.findAll({ where: { id: [1, 2] } });
    
    // Utilitzar addCategories en lloc de setCategories
    await Promise.all(categories.map(categoria => {
      return video.addCategoria(categoria);
    }));
  });
  
  describe('Flux complet de l\'API', () => {
    // Test de lectura de youtubers
    it('hauria d\'obtenir tots els youtubers i els seus vídeos', async () => {
      // Provar la ruta de youtubers
      const resYoutubers = await request(app)
        .get('/api/youtubers')
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(resYoutubers.body.ok).toBe(true);
      expect(resYoutubers.body.resultat).toHaveLength(1);
      expect(resYoutubers.body.resultat[0].nom_canal).toBe('Canal Test');
      
      // Provar la ruta de vídeos del youtuber
      const youtuberID = resYoutubers.body.resultat[0].id;
      const resVideos = await request(app)
        .get(`/api/youtubers/${youtuberID}/videos`)
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(resVideos.body.ok).toBe(true);
      expect(resVideos.body.resultat).toHaveLength(1);
      expect(resVideos.body.resultat[0].titol).toBe('Video Test');
      
      // Provar la ruta de categories del vídeo
      const videoID = resVideos.body.resultat[0].id;
      const resCategories = await request(app)
        .get(`/api/videos/${videoID}/categories`)
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(resCategories.body.ok).toBe(true);
      expect(resCategories.body.resultat).toHaveLength(2);
    });
    
    // Test de creació d'un nou vídeo
    it('hauria de crear un nou vídeo i recuperar-lo', async () => {
      // Crear un nou vídeo
      const nouVideo = {
        titol: 'Nou Video Test',
        descripcio: 'Descripció del nou video de test',
        url_video: 'https://test.com/nou-video',
        youtuber_id: 1,
        data_publicacio: new Date().toISOString(),
        categories: [1, 2]
      };
      
      const resCrearVideo = await request(app)
        .post('/api/videos')
        .send(nouVideo)
        .expect('Content-Type', /json/)
        .expect(201);
        
      expect(resCrearVideo.body.ok).toBe(true);
      expect(resCrearVideo.body.resultat.titol).toBe('Nou Video Test');
      
      // Verificar que el vídeo s'ha creat correctament
      const videoID = resCrearVideo.body.resultat.id;
      const resVideoCreat = await request(app)
        .get(`/api/videos/${videoID}`)
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(resVideoCreat.body.ok).toBe(true);
      expect(resVideoCreat.body.resultat.titol).toBe('Nou Video Test');
      
      // Verificar les categories del vídeo
      const resCategories = await request(app)
        .get(`/api/videos/${videoID}/categories`)
        .expect('Content-Type', /json/)
        .expect(200);
        
      expect(resCategories.body.ok).toBe(true);
      expect(resCategories.body.resultat).toHaveLength(2);
    });
  });
  
  // Tancar la connexió a la base de dades al finalitzar
  afterAll(async () => {
    try {
      await sequelize.close();
    } catch (error) {
      console.log('Error tancant la connexió:', error.message);
    }
  });
});