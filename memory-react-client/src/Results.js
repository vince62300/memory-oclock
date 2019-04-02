import React from "react";
import { Link } from "react-router-dom";

import "./assets/results.scss";

//
// Cette classe représente la page de résultats qui s'affiche au lancement du site.
// Elle permet de voir la liste des résultats et de lancer une nouvelle partie.
//
class Results extends React.Component {
  constructor(props) {
    super(props);

    // initialisation des scores
    //
    this.state = {
      scores: []
    };
  }

  //
  // Dès que le composant est chargé, on lance la requête à notre serveur pour récupérer les 10 meilleurs scores.
  componentDidMount() {
    fetch("http://localhost:4000/highest?max=10")
      .then(response => {
        return response.json();
      })
      .then(data => {
        // on récupère, en réponse à la requête, la liste des 10 meilleurs scores que l'on stocke dans notre tableau scores.
        // Comme on modifie une variable de l'objet "state", le composant sera de nouveau rendu avec les scores actualisés.
        //
        this.setState({ scores: data });
      });
  }

  render() {
    return (
      <div id="results">
        <h2>Meilleurs scores</h2>
        <ul id="scores">
          {this.state.scores.map(item => {
            return <li key={item.id}>{item.temps}s</li>;
          })}
        </ul>
        <Link to="/game">Démarrer une partie</Link> <!-- Link permet de créer un lien vers la page d'une partie en utilisant le Router React -->
      </div>
    );
  }
}

export default Results;
