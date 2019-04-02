import React from "react";

//
// import de la css du composant
//
import "./assets/card.scss";

//
// Cette classe est une représentation d'une carte du jeu.
//
class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    // Calcul du nombre de pixel à décaler pour trouver la bonne image en fonction de l'index passé en attribut.
    //
    const position = "0 " + (-this.props.index * 100).toString() + "px";

    return (
      <div className="card">
        <div className="card__content">
          <div className="card__front">
            <div className="card__front__image" style={{ backgroundPosition: position }} />
          </div>
          <div className="card__back" />
        </div>
      </div>
    );
  }
}

export default Card;
