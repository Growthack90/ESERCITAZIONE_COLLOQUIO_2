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

## Test dell'applicazione

### Preparare il database

Il backend legge il database `blog` e la collection `posts`, come indicato in `MONGODB_URI=mongodb://127.0.0.1:27017/blog`. L'albero in Compass deve essere:

```text
localhost:27017      (connessione)
└── blog             (database)
    └── posts        (collection)
```

Procedura corretta in Compass:

1. Clicca **+** accanto a `localhost:27017` (**Create database**).
2. Inserisci **Database Name** `blog` e **Collection Name** `posts`, poi **Create Database**.
3. Apri `blog`, poi `posts`.
4. Clicca **ADD DATA**, poi **Import JSON or CSV file**.
5. Seleziona `seed/posts.json`, formato **JSON**, e clicca **Import**.

Errori comuni:

- Il **nome della connessione** (etichetta in Compass) non è il database. Il database è il livello sotto la connessione.
- Un database con un nome diverso (ad esempio `seeds`) non viene letto dal backend: `/api/posts` restituirebbe `[]`.
- Il nome della collection deve essere `posts`, perché Mongoose ricava `posts` dal modello `Post`.

### Differenza tra i due URL

Avvia il server con `npm run dev` e apri questi URL nel browser (sono richieste `GET`, senza autenticazione).

| URL | Cosa restituisce |
| --- | ---------------- |
| `http://localhost:3000/api/posts` | Tutti i post con `status: "published"`, dal più recente. Le bozze (`draft`) non compaiono. |
| `http://localhost:3000/api/posts?hashtag=node` | Solo i post pubblicati che hanno l'hashtag `node`. |

Con i dati di `seed/posts.json`:

- Senza filtro: **3** post (Node.js, Express, Mongoose).
- Con `?hashtag=node`: **2** post (Introduzione a Node.js e REST API con Express).

Il parametro `hashtag` si può ripetere per cercare più hashtag: `?hashtag=node&hashtag=mongodb` restituisce i post che hanno almeno uno dei due. Se nessun post corrisponde, la risposta è `[]`.

Se ottieni `[]` senza filtro, controlla che i dati siano in `blog` → `posts` e che esistano post con `status: "published"`.

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

## START APP

Controlla se è attivo MongoDB:
```powershell
Get-Service *mongo*
```

Se il servizio si chiama `MongoDB` ed è fermo, avvialo (potrebbe servire PowerShell come amministratore):
```powershell
Start-Service MongoDB
```

Configura e avvia il backend
```powershell
cd "../blog-backend"

if (-not (Test-Path .env)) { Copy-Item .env.example .env }
notepad .env
```

Nel file `.env`, verifica che ci siano valori simili a questi; sostituisci il token di esempio con uno scelto da te:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/blog
ADMIN_TOKEN=il-tuo-token-segreto
```

Salva il file, poi avvia l’app:

```powershell
npm install
npm run dev
```

Lascia aperta questa finestra. 
Dovresti vedere un messaggio di connessione a MongoDB e che il backend ascolta sulla porta `3000`.

Prova gli endpoint
```powershell
curl.exe http://localhost:3000/api/posts
```

### Creare post

Lascia il server aperto e, in un’altra finestra PowerShell, esegui questa singola riga, sostituendo IL_TUO_TOKEN con il valore di ADMIN_TOKEN:
```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/posts" -Headers @{ Authorization = "Bearer IL_TUO_TOKEN" } -ContentType "application/json" -Body (@{ title = "Mio post"; body = "Contenuto del post"; hashtags = @("node") } | ConvertTo-Json -Compress)
```

Se il token non corrisponde, l’app risponde `401 Unauthorized`. 
Se vuoi ulteriori dettagli su MongoDB e Compass, consulta `MONGODB.md`.


### Publcare post

Il post appena creato ha stato `draft` (bozza), mentre la lista mostra solo quelli con stato `published`.

1. Copia il valore `_id` restituito quando hai creato il post. Puoi trovarlo anche in MongoDB Compass, nella collection `blog` → `posts`.

2. Esegui questa riga in PowerShell, sostituendo `ID_DEL_POST` e `IL_TUO_TOKEN`:

```powershell
Invoke-RestMethod -Method Patch -Uri "http://localhost:3000/api/posts/ID_DEL_POST/publish" -Headers @{ Authorization = "Bearer IL_TUO_TOKEN" }
```

### Visualizza post

Per visualizzare i post pubblicati:

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:3000/api/posts"
```

Il backend restituisce i post come dati JSON; non c’è una pagina web del blog in questa applicazione.

---