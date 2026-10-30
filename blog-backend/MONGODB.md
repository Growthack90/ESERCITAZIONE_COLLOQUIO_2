# Guida MongoDB, Compass e database `blog`

Comandi PowerShell e passaggi per verificare MongoDB, collegare l'app e popolare il database.

## 1. Verificare che MongoDB sia attivo

```powershell
# Stato del servizio (Status deve essere Running)
Get-Service MongoDB

# Se il nome è diverso
Get-Service *mongo*

# Il processo è in esecuzione
Get-Process mongod

# La porta 27017 risponde (TcpTestSucceeded : True)
Test-NetConnection 127.0.0.1 -Port 27017
```

Con `mongosh` installato:

```powershell
# Risponde { ok: 1 } se MongoDB funziona
mongosh --eval "db.runCommand({ ping: 1 })"

# Elenca i database presenti
mongosh --quiet --eval "db.adminCommand({ listDatabases: 1 }).databases.map(d => d.name)"
```

### Avviare, fermare, riavviare

Richiedono un PowerShell aperto **come amministratore**. Senza permessi, `Stop-Service` fallisce con "Impossibile arrestare il servizio".

```powershell
Start-Service MongoDB
Stop-Service MongoDB
Restart-Service MongoDB
```

Riavviare MongoDB non cancella i dati.

**_Nota:_** se da problemi, avviare la PowerShell con privilegi di amministratore.


## 2. Collegarsi con MongoDB Compass

1. Apri Compass.
2. Nel campo URI inserisci `mongodb://127.0.0.1:27017` (di solito è già precompilato).
3. Clicca **Connect**. Il pallino verde accanto a `localhost:27017` indica che sei connesso.
4. Se non vedi un database, clicca **Refresh** o disconnettiti e riconnettiti.

I database `admin`, `config` e `local` sono di sistema. MongoDB non mostra database o collection vuoti: nascono al primo inserimento.

Per rimuovere una connessione salvata in Compass: passa il mouse sulla connessione, apri il menu `⋯` e scegli **Remove**. I dati non vengono toccati.

## 3. Collegare l'app a MongoDB

1. Crea il file `.env` dall'esempio (salta il primo comando se `.env` esiste già, per non sovrascriverlo):

   ```powershell
   cd blog-backend
   Copy-Item .env.example .env
   ```

2. Controlla che `MONGODB_URI` punti al database `blog`:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/blog
   ```

3. Imposta un valore reale per `ADMIN_TOKEN`.
4. Installa le dipendenze e avvia:

   ```powershell
   npm install
   npm run dev
   ```

5. Nel terminale devono comparire:

   ```text
   Connected to MongoDB
   Blog backend listening on port 3000
   ```

Se la connessione fallisce, verifica che MongoDB sia attivo (sezione 1) e che `MONGODB_URI` sia corretto.

## 4. Creare il database `blog`

Ci sono due modalità.

### Modalità A: creazione dall'app

Il database e la collection `posts` vengono creati da Mongoose al primo inserimento.

1. Avvia l'app (`npm run dev`).
2. Crea un post:

   ```powershell
   curl.exe -X POST http://localhost:3000/api/posts `
     -H "Authorization: Bearer IL_TUO_TOKEN" `
     -H "Content-Type: application/json" `
     -d '{\"title\":\"Primo post\",\"body\":\"Contenuto\",\"hashtags\":[\"js\",\"node\"]}'
   ```

   Usa `curl.exe` e non `curl`, perché in PowerShell `curl` è un alias di un altro comando.

3. In Compass clicca **Refresh**: compare `blog` con la collection `posts`.

### Modalità B: importare il file di esempio

Il file [seed/posts.json](./seed/posts.json) contiene 5 post: 3 `published` e 2 `draft`.

**Da Compass**

1. Clicca **+** accanto a `localhost:27017` (**Create database**).
2. Inserisci **Database Name** `blog` e **Collection Name** `posts`, poi **Create Database**.
3. Apri `blog`, poi `posts`.
4. Clicca **ADD DATA**, poi **Import JSON or CSV file**.
5. Seleziona `seed/posts.json`, formato **JSON**, e clicca **Import**.

**Da terminale** (richiede `mongoimport` dei MongoDB Database Tools):

```powershell
mongoimport --uri "mongodb://127.0.0.1:27017/blog" --collection posts --file seed/posts.json --jsonArray
```

Se importi il file più volte, i post risulteranno duplicati. Per ripartire da zero:

```powershell
mongosh "mongodb://127.0.0.1:27017/blog" --eval "db.posts.drop()"
```

## 5. Verificare il risultato

```powershell
# Solo post pubblicati (con il seed: 3)
curl.exe http://localhost:3000/api/posts

# Filtro per hashtag
curl.exe "http://localhost:3000/api/posts?hashtag=node"
```

Per pubblicare una bozza, copia il suo `_id` da Compass:

```powershell
curl.exe -X PATCH http://localhost:3000/api/posts/ID_DEL_POST/publish `
  -H "Authorization: Bearer IL_TUO_TOKEN"
```

## 6. Eliminare un database

In Compass, passa il mouse sul database, clicca l'icona del cestino e conferma scrivendo il nome. L'operazione è irreversibile.

Da terminale:

```powershell
mongosh "mongodb://127.0.0.1:27017/blog" --eval "db.dropDatabase()"
```

## Avvio Applicazione

```powershell
npm run dev

# > blog-backend@1.0.0 dev
# > node --watch server.js
# 
# Connected to MongoDB
# Blog backend listening on port 3000
```

---