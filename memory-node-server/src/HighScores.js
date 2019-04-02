// Le moteur de base de données utilisé est MySQL.
// C'est pourquoi on importe l'objet mysql pour manipuler les connexions facilement.
//
import mysql from "mysql";

//
// Cette classe permet de gérer les scores.
//
class HighScores {
  constructor() {

    // Les scores sont stockés dans la base de données locale "memory".
    //
    this.connection = mysql.createConnection({
      host: 'localhost', // la base de données est en local
      user: 'root', // utilisateur ayant les droits sur la base de données
      password: 'kcpot62300', // mot de passe de l'utilisateur.
      database: 'memory' // nom de la base de données.
    });

    // Connection à la base de données.
    //
    this.connection.connect(err => {
      if (err) {
        console.log(err);

        // si la connexion échoue, on invalide celle-ci.
        //
        this.connection = null;
      }
    });

  }

  //
  // Cette méthode permet de récupérer de façon asynchrone dans la base de données la liste de tous les scores.
  //
  getHighScores() {
    return new Promise((resolve, reject) => {
      const SELECT_HIGH_SCORES_QUERY = "SELECT * FROM high_results";

      if (this.connection != null) {
        this.connection.query(SELECT_HIGH_SCORES_QUERY, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      } else {
        reject("Database not connected");
      }
    });
  }

  //
  // Cette méthode permet de récupérer de façon asynchrone dans la base de données la liste des "maxScores" meilleurs scores.
  //
  getHighestScores(maxScores) {
    return new Promise((resolve, reject) => {
      const SELECT_HIGH_SCORES_QUERY = `SELECT * FROM high_results ORDER BY temps DESC LIMIT ${maxScores}`;

      if (this.connection != null) {
        this.connection.query(SELECT_HIGH_SCORES_QUERY, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      } else {
        reject("Database not connected");
      }
    });
  }

  //
  // Cette méthode permet d'ajouter dans la base de données de façon asynchrone un nouveau score.
  //
  addHighScore(time) {
    return new Promise((resolve, reject) => {
      const INSERT_HIGH_SCORE_QUERY = `INSERT INTO high_results(temps) VALUES('${time}')`;

      if (this.connection != null) {
        this.connection.query(INSERT_HIGH_SCORE_QUERY, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve('ok');
          }
        });
      } else {
        reject("Database not connected");
      }
    });
  }
}

export default HighScores;