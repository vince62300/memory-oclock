import express from "express";

import HighScores from "./HighScores";

// instantiation de l'objet du serveur utilisant la librairie Express.
//
const app = express();

// Utilisation du middleware json d'Express.
//
app.use(express.json());

// port sur lequel le serveur va écouter.
//
const port = process.env.PORT | 4000;

// Création de notre instance de notre classe gérant les scores.
//
const highScores = new HighScores();

//
// Création des différentes routes de notre API.
//

// Route permettant de récupérer tous les scores.
//
app.get('/',(req, res) => {
  highScores.getHighScores().then((result) => {
    res.json(result);
  }).catch(err => {
    res.status(500); // code indiquant une erreur au niveau du serveur
    res.send(err);
  });
});

// Route permettant de récupérer les "max" meilleurs scores (par défaut 10 si le paramètre "max" n'est pas renseigné.
//
app.get('/highest', (req, res) => {
  const { max } = req.query | 10;

  highScores.getHighestScores(max).then((result) => {
    res.json(result);
  }).catch(err => {
    res.status(500); // code indiquant une erreur au niveau du serveur
    res.send(err);
  });
});

// Route permettant de sauvegarder un nouveau score dans la base.
//
app.post('/add', (req, res) => {

  if (req.body == null) {
    res.status(400); // code indiquant une erreur au niveau de la requête
    res.send("No time sent.");
  }

  const { temps } = req.body;

  highScores.addHighScore(temps).then((result) => {
    res.send(result);
  }).catch(err => {
    res.status(500); // code indiquant une erreur au niveau du serveur
    res.send(err);
  })
});

// Lancement du serveur sur le port "port".
//
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

