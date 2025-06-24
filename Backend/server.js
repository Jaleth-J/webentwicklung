// server.js

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Verbindung zu MongoDB
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'autoratespiel';

app.use(cors());
app.use(express.json());
// Registrierung
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const userExists = await users.findOne({ username });
    if (userExists) {
      return res.json({ success: false, message: 'Benutzername existiert bereits.' });
    }

    await users.insertOne({
      username,
      password,
      highscore: { level1: 0, level2: 0 }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Serverfehler bei Registrierung' });
  } finally {
    await client.close();
  }
});
app.post('/saveScore', async (req, res) => {
  const { username, level, score } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    await users.updateOne(
      { username },
      { $max: { [`highscore.${level}`]: score } } // nur wenn score besser ist!
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Speichern' });
  } finally {
    await client.close();
  }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const user = await users.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Benutzername oder Passwort falsch' });
    }

    res.json({ success: true, highscore: user.highscore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Login' });
  } finally {
    await client.close();
  }
});
app.delete('/deleteUser', async (req, res) => {
  const { username } = req.body;

  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection('users');

    const result = await users.deleteOne({ username });

    if (result.deletedCount === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Benutzer nicht gefunden' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Löschen' });
  } finally {
    await client.close();
  }
});





// Test-Route → Wichtig!
app.get('/', (req, res) => {
  res.send('✅ MongoDB verbunden. Backend läuft!');
});

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
