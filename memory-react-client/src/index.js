import React from "react";
import ReactDom from "react-dom";
import { HashRouter as Router, Route } from "react-router-dom";

import Results from "./Results";
import Board from "./Board";

//
// import du style de mon composant App.
//
import "./assets/main.scss";

//
// Classe représentant notre composant principal.
//
class App extends React.Component {
  //
  // fonction de rendu du code html de notre composant à afficher.
  //
  render() {
    // On utilise ici un router pour afficher
    // - soit le composant "Results" si le chemin passé dans l'url est "/"
    // - soit le plateau de jeu si le chemin est "/game".
    //
    return (
      <Router>
        <div id="game">
          <h1>Jeu du Memory</h1>
          <Route path="/" exact component={Results} />
          <Route path="/game" component={Board} />
        </div>
      </Router>
    );
  }
}

//
// Rendu du code html de notre composant principal "App" dans le fichier index.html sous l'élément div qui a l'ID "root".
//
ReactDom.render(<App />, document.getElementById("root"));
