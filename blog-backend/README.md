# Blog Backend

REST API per un blog e un content management system, costruita con Express, MongoDB (Mongoose) e ES Modules.

## Requisiti

- Node.js 20 o superiore
- MongoDB in esecuzione (locale o remoto)

## Avvio rapido (progetto già presente)

Il `package.json` esiste già con dipendenze e script: basta installarle.

```powershell
cd blog-backend
npm install
npm run dev
```

Non servono `npm init -y` né `npm install express mongoose dotenv`: le dipendenze sono già dichiarate nel `package.json`.

## Configurazione

Copia `.env.example` in `.env` (`Copy-Item .env.example .env`) oppure crea un file `.env` nella radice di `blog-backend`, ad esempio:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/blog
ADMIN_TOKEN=replace-this-with-a-long-random-token
```

Variabili:

| Variabile      | Descrizione                                  |
| -------------- | -------------------------------------------- |
| `PORT`         | Porta del server (default `3000`)            |
| `MONGODB_URI`  | Stringa di connessione a MongoDB             |
| `ADMIN_TOKEN`  | Token Bearer richiesto per le operazioni di modifica |

Sostituisci il valore segnaposto di `ADMIN_TOKEN` con un token lungo e casuale. Il file `.env` è escluso da Git.

## Script

| Comando       | Descrizione                                              |
| ------------- | -------------------------------------------------------- |
| `npm start`   | Avvia il server con Node                                 |
| `npm run dev` | Avvia il server con `node --watch` (riavvio automatico)  |


## Inizializzare il progetto da zero

Per ricreare il progetto partendo da una cartella vuota:

```powershell
mkdir blog-backend
cd blog-backend
npm init -y
npm install express mongoose dotenv
npm install --save-dev nodemon  
```
_Nota:_ leggi sotto la sezione dedicata [Nodemon (opzionale)](#nodemon-opzionale).

Poi:

1. Imposta `"type": "module"` nel `package.json` (il codice usa `import`/`export`).
2. Aggiungi gli script:

   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "node --watch server.js"
   }
   ```

3. Crea la struttura delle cartelle e dei file:

   ```text
   blog-backend/
   ├── src/
   │   ├── config/db.js
   │   ├── controllers/postController.js
   │   ├── middlewares/auth.js
   │   ├── middlewares/errorHandler.js
   │   ├── models/Post.js
   │   ├── routes/postRoutes.js
   │   └── app.js
   ├── .env
   ├── .gitignore
   ├── package.json
   └── server.js
   ```

4. Crea il file `.env` con `PORT`, `MONGODB_URI` e `ADMIN_TOKEN`, e aggiungi `node_modules/` e `.env` a `.gitignore`.

## API

Base URL: `http://localhost:3000/api/posts`

Le richieste di modifica richiedono l'header `Authorization: Bearer <ADMIN_TOKEN>`.

| Metodo   | Endpoint        | Auth | Descrizione                                              |
| -------- | --------------- | ---- | -------------------------------------------------------- |
| `GET`    | `/`             | No   | Elenca i post pubblicati; filtro opzionale `?hashtag=js` |
| `POST`   | `/`             | Sì   | Crea un post (stato `draft`, autore `Brian Fox`)         |
| `PATCH`  | `/:id/publish`  | Sì   | Pubblica un post                                         |
| `DELETE` | `/:id`          | Sì   | Elimina un post                                          |

Esempio di creazione:

```powershell
curl -X POST http://localhost:3000/api/posts `
  -H "Authorization: Bearer <ADMIN_TOKEN>" `
  -H "Content-Type: application/json" `
  -d '{"title":"Primo post","body":"Contenuto","hashtags":["js","node"]}'
```

## Nodemon (opzionale)

`nodemon` non è necessario: lo script `dev` usa già `node --watch`, integrato in Node.js, che riavvia il server a ogni modifica.

Se preferisci `nodemon`:

```powershell
npm install --save-dev nodemon
```

Poi modifica lo script in `package.json`:

```json
"dev": "nodemon server.js"
```

---