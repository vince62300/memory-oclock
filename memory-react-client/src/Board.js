import React from "react";

//
// import du composant "Card" représentant une carte du jeu.
//
import Card from "./Card";

//
// import de la css du composant
//
import "./assets/board.scss";

//
// Cette classe représente le plateau du jeu de Memory
//
class Board extends React.Component {
  //
  // Constructeur du composant "Board"
  //
  constructor(props) {
    //
    // On appelle le constructeur de la classe mère "React.Component".
    //
    super(props);

    //
    // On initialise les propriétés de la classe avec des valeurs par défaut.
    //

    // Variable contenant les 28 cartes.
    // C'est un tableau dont chaque élément contient:
    //   ---------------------------
    //     - id : un id unique (il sera passé en tant que valeur de l'argument key de chaque carte pour permettre à React de différencier chaque carte.
    //     - un index : correspond à l'index de l'image à afficher.
    //     - isRevealed: un booléen indiquant si la carte est retournée ou non.
    //   ---------------------------
    this.cards = new Array(28);

    this.cardsElement = []; // Variable contenant les 28 cartes (éléments du DOM).

    this.gameWon = false;

    this.intervalHandle = null; // Handle sur le timer de mise à jour de la barre de progression. Nécessaire pour arrêter ce timer lorsque la partie est terminée.
    this.gameTimeOutHandle = null; // Handle sur le timer du jeu. Nécessaire pour arrêter ce timer lorsque la partie est terminée.

    this.state = {
      // booléen indiquant si le jeu est suspendu ou non.
      // S'il est à vrai, l'utilisateur ne peut pas cliquer sur les cartes pour les retourner.
      // S'il est à faux, l'utilisateur peut jouer.
      isGameSuspended: false,
      selectedCardIndex: -1, // permet de retenir l'index de la première des 2 cartes retournées.
      cardsSelectedCount: 0, // indique le nombre de cartes sélectionnées.
      cardsFound: 0, // indique combien de paires de cartes ont été trouvées.

      progressBarValue: 0 // contient le nombre de millisecondes depuis que la barre de progression a démarré.
    };

    //
    // raccourci d'écriture pour éviter de devoir inclure le contexte de la classe chaque fois que la fonction est passée comme callback.
    //
    this.generateBoard = this.generateBoard.bind(this);
    this.updateProgressBar = this.updateProgressBar.bind(this);

    //
    // Création du plateau.
    //
    this.generateBoard();
  }

  //
  // Cette fonction est appelée automatiquement dès que le composant est créé.
  //
  componentDidMount() {
    //
    // On récupère toutes les cartes. On sélectionne le "content" des cartes
    // car c'est cette partie qui doit se retourner et non la carte complète.
    //
    this.cardsElement = document.querySelectorAll(".card .card__content");

    //
    // On ajoute une callback pour chaque carte lorsque l'utilisateur clique sur celle-ci.
    //
    for (let index = 0; index < this.cardsElement.length; ++index) {
      this.cardsElement[index].addEventListener("click", this.cardClicked.bind(this, index));
    }

    //
    // Dès que le composant est créé, la partie commence.
    // Du coup on lance le timer de 2 minutes (120000ms) qui s'il se déclenche indiquera que la partie est perdue.
    //
    this.gameTimeOutHandle = setTimeout(this.displayEndGameMessage.bind(this, "Désolé, tu as perdu."), 120000);

    //
    // On lance également le timer de mise à jour de la barre de progression.
    // On mettra à jour celle-ci toutes les 100ms.
    //
    this.intervalHandle = setInterval(this.updateProgressBar, 100);
  }

  componentWillUnmount() {
    //
    // suppression de la callback pour chaque carte.
    //
    for (let index = 0; index < this.cardsElement.length; ++index) {
      this.cardsElement[index].removeEventListener("click", this.cardClicked.bind(this, index));
    }

    //
    // Le composant est détruit, on arrête tous les timers.
    //
    clearInterval(this.intervalHandle);
    clearTimeout(this.gameTimeOutHandle);
  }

  //
  // Fonction permettant de retourner un entier aléatoire compris dans l'intervalle [0, max[
  //
  static getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  //
  // Fonction générant le plateau du jeu (représentation interne). Elle crée toutes les cartes et les mélange.
  //
  generateBoard() {
    let id = 0;

    //
    // Initialise le tableau de cartes. Chaque paire de cartes semblables sont côte à côte.
    //
    for (let i = 0; i < 14; ++i) {
      //
      // Initialise chaque carte à une position paire avec l'index d'une image différente.
      //
      this.cards[i * 2] = {
        id: id++,
        index: i,
        isRevealed: false
      };

      //
      // Initialise chaque carte à une position impaire avec l'index de la même image que celle de la position précédente.
      //
      this.cards[i * 2 + 1] = {
        id: id++,
        index: i,
        isRevealed: false
      };
    }

    //
    // Mélange du tableau de cartes.
    //
    // On part de la fin du tableau de cartes et on s'arrête à la 2ème case de celui-ci.
    //
    for (let index = this.cards.length - 1; index > 0; --index) {

      // On prend l'index d'une autre carte aléatoire située avant la carte à la position "index" dans le tableau.
      //
      let index2 = Board.getRandomInt(index + 1);

      // On échange les 2 cartes dans le tableau.
      //
      [this.cards[index], this.cards[index2]] = [this.cards[index2], this.cards[index]];
    }
  }

  //
  // Fonction permettant de remettre face cachée les 2 cartes retournées mais qui ne correspondent pas.
  // Cette fonction est appelée lorsque 2 cartes sont retournées après un délai.
  //
  resetCards(cardIndex1, cardIndex2) {

    // On indique que les 2 cartes sont de nouveau face cachée.
    //
    this.cards[cardIndex1].isRevealed = false;
    this.cards[cardIndex2].isRevealed = false;

    // On supprime la classe "card__returned" de chacune des cartes ce qui les fera se retourner.
    //
    this.cardsElement[cardIndex1].classList.remove("card__returned");
    this.cardsElement[cardIndex2].classList.remove("card__returned");

    // On réinitialise le compteur de cartes retournées à 0 et on relance le jeu.
    //
    this.setState({ isGameSuspended: false, cardsSelectedCount: 0 });
  }

  //
  // Fonction mettant à jour la valeur de la barre de progression (appelée toutes les 100ms).
  //
  updateProgressBar() {
    this.setState({ progressBarValue: this.state.progressBarValue + 100 });
  }

  //
  // Fonction affichant un message à la fin de la partie dans une popup.
  // Redirige vers la page d'accueil après fermeture de la popup.
  //
  displayEndGameMessage(message) {
    //
    // La partie est terminée, on arrête tous les timers.
    //
    clearInterval(this.intervalHandle);
    clearTimeout(this.gameTimeOutHandle);

    //
    // Affichage de la popup avec le message
    //
    window.alert(message);

    //
    // Envoi du temps pour le sauvegarder en base de données si la partie est gagnée.
    //
    if (this.gameWon === true) {
      fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({time: this.state.progressBarValue / 100})
      }).then(res => {
        //
        // retour à la page principale (page des résultats).
        //
        document.location.href = "/";
      });
    }
  }

  //
  // Fonction appelée après chaque clique sur une carte du plateau de jeu.
  //
  cardClicked(index) {
    if (this.cards[index].isRevealed === true || this.state.isGameSuspended === true || this.state.cardsSelectedCount >= 2) {
      return;
    }

    this.setState({ cardsSelectedCount: this.state.cardsSelectedCount + 1 });

    this.cards[index].isRevealed = true;
    this.cardsElement[index].classList.add("card__returned");

    if (this.state.selectedCardIndex === -1) {
      this.setState({ selectedCardIndex: index });
    } else {
      if (this.cards[index].index !== this.cards[this.state.selectedCardIndex].index) {
        this.isGameSuspended = true;

        setTimeout(this.resetCards.bind(this, index, this.state.selectedCardIndex), 1000);

        this.setState({ selectedCardIndex: -1 });
      } else {
        this.setState({
          cardsSelectedCount: 0,
          selectedCardIndex: -1,
          cardsFound: this.state.cardsFound + 1
        });

        if (this.state.cardsFound === 14) {
          this.isGameSuspended = true;
          this.gameWon = true;

          setTimeout(this.displayEndGameMessage.bind(this, "Super !!! Tu as gagné !!!!"), 500);
        }
      }
    }
  }

  //
  // Fonction de rendu du composant
  // Cette fonction est appelée automatiquement lors du chargement du composant ou lorsqu'un élément contenu dans l'objet "state" est modifié.
  //
  render() {
    // calcul du remplissage de la barre de progression en pixel.
    //
    let progressValue = ((this.state.progressBarValue * 100) / 120000).toString() + "px";

    return (
      <div id="board">
        {this.cards.map(item => {
          return <Card key={item.id} index={item.index} />;
        })}

        <div id="progressBarEmpty">
          <div id="progressBarInProgress" style={{ width: progressValue }} />
        </div>
      </div>
    );
  }
}

// export de la classe Board pour utilisation à l'extérieur du fichier
//
export default Board;
