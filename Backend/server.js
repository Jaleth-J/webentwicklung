const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'autoratespiel';

app.use(cors());
app.use(express.json());


let db;
client.connect().then(() => {
  db = client.db(dbName);
  console.log("✅ Verbunden mit MongoDB");
});


app.get('/', (req, res) => {
  res.send('✅ Backend läuft & MongoDB ist verbunden');
});


app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = db.collection('users');
    const exists = await users.findOne({ username });
    if (exists) return res.json({ success: false, message: "Benutzer existiert bereits" });

    await users.insertOne({ username, password, highscore: { level1: 0, level2: 0 } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler bei Registrierung' });
  }
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.collection('users').findOne({ username, password });
    if (!user) return res.json({ success: false, message: 'Falsche Anmeldedaten' });

    res.json({ success: true, highscore: user.highscore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Login' });
  }
});


app.post('/saveScore', async (req, res) => {
  const { username, level, score } = req.body;
  try {
    await db.collection('users').updateOne(
      { username },
      { $max: { [`highscore.${level}`]: score } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Score-Speichern' });
  }
});


app.delete('/delete-user', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: 'Kein Benutzername angegeben.' });
  }

  try {
    const result = await db.collection('users').deleteOne({ username });

    if (result.deletedCount === 1) {
      res.json({ success: true, message: 'Benutzer gelöscht.' });
    } else {
      res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
    }
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(500).json({ success: false, message: 'Interner Serverfehler.' });
  }
});

app.get('/leaderboard/:level', async (req, res) => {
  const level = req.params.level;
  try {
    const users = await db.collection('users')
      .find({}, { projection: { username: 1, [`highscore.${level}`]: 1 } })
      .sort({ [`highscore.${level}`]: -1 })
      .limit(20)
      .toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Fehler beim Leaderboard' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});
