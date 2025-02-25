# API de YouTubers de Programació (Exemple Sequelize)

Aquesta API proporciona accés a informació sobre youtubers que creen contingut relacionat amb programació, els seus perfils, vídeos i categories.

## Descripció del Projecte

Aquest projecte és una API RESTful desenvolupada amb Node.js, Express i Sequelize (ORM) que gestiona informació sobre youtubers especialitzats en contingut de programació. L'aplicació utilitza una base de dades SQLite i ofereix diferents endpoints per consultar i gestionar la informació.

## Característiques

- **CRUD complet** per a youtubers, perfils, vídeos i categories
- **Swagger UI** per a documentació interactiva de l'API
- **Validació de dades** amb sistema automàtic de verificació de CSVs
- **Logging extensiu** amb Winston per a desenvolupament i depuració
- **Gestió centralitzada d'errors** per a respostes consistents
- **Sistema de càrrega de dades** des d'arxius CSV

## Requisits

- Node.js >= 14.x
- npm >= 6.x

## Instal·lació

1. Instal·la les dependències:
```bash
npm install
```

2. Configura les variables d'entorn creant un arxiu `.env` a l'arrel del projecte:
```
NODE_ENV=development
PORT=3000
DB_PATH=../../data/youtuber_db.sqlite
DATA_DIR_PATH=../data
LOG_FILE_PATH=../data/logs
LOG_LEVEL=info
```

## Ús

### Iniciar el servidor

```bash
# Mode producció
npm start

# Mode desenvolupament amb recàrrega automàtica
npm run dev

# Mode debug
npm run debug
```

### Carregar dades inicials

```bash
npm run load-data
```

### Validar dades CSV

```bash
npm run validate-csv
```

### Executar tests

```bash
npm test
```

## Estructura de la Base de Dades

L'aplicació utilitza els següents models:

- **Youtuber**: Informació bàsica sobre el youtuber (nom, canal, etc.)
- **PerfilYoutuber**: Informació de perfil (xarxes socials, contacte, etc.)
- **Video**: Vídeos publicats pels youtubers
- **Categoria**: Categories de programació (JavaScript, Python, etc.)
- **VideosCategories**: Relació molts a molts entre vídeos i categories

## Endpoints de l'API

Els principals endpoints disponibles són:

### Youtubers
- `GET /api/youtubers`: Obté tots els youtubers
- `GET /api/youtubers/:id`: Obté un youtuber específic
- `GET /api/youtubers/:id/perfil`: Obté el perfil d'un youtuber
- `GET /api/youtubers/:id/videos`: Obté els vídeos d'un youtuber

### Vídeos
- `GET /api/videos`: Obté tots els vídeos
- `GET /api/videos/:id`: Obté un vídeo específic
- `GET /api/videos/:id/categories`: Obté les categories d'un vídeo
- `POST /api/videos`: Crea un nou vídeo

### Categories
- `GET /api/categories`: Obté totes les categories

## Documentació

La documentació completa de l'API està disponible a través de Swagger UI:

```
http://localhost:3000/api-docs
```

## Estructura del Projecte

```
.
├── data/
│   ├── logs/             # Arxius de log
│   └── youtubers_programacio/  # Dades CSV
├── src/
│   ├── config/           # Configuració (BD, logger, Swagger)
│   ├── controllers/      # Controladors per a cada entitat
│   ├── middleware/       # Middleware (gestió d'errors, etc.)
│   ├── models/           # Models Sequelize
│   ├── routes/           # Definició de rutes
│   └── utils/            # Utilitats (validació CSV, etc.)
├── tests/                # Tests unitaris i d'integració
├── .env                  # Variables d'entorn (no inclòs al repo)
├── server.js             # Punt d'entrada principal
├── loadData.js           # Script per carregar dades des de CSV
└── package.json          # Dependències i scripts
```

## Desenvolupament

### Dependències Principals

- **express**: Framework web
- **sequelize**: ORM per a la base de dades
- **sqlite3**: Driver de base de dades SQLite
- **winston**: Sistema de logging
- **papaparse**: Parsing d'arxius CSV
- **swagger-jsdoc/swagger-ui-express**: Documentació de l'API

### Dependències de Desenvolupament

- **jest**: Framework de testing
- **nodemon**: Recàrrega automàtica en desenvolupament
- **supertest**: Testing d'API HTTP
- **cross-env**: Variables d'entorn multiplataforma
