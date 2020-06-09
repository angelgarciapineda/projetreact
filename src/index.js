import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";

import "./styles.css";

//import data from "./data.json";
import { DetailRecette } from "./detailRecette";
import Recettes from "./recetteList"; // Defualt importation (no {})

//import dataliste from "./dataliste.json";
import Listes from "./liste"; // Defualt importation (no {})
import { DetailListe } from "./detailListe";

function App() {
  return (
    <Router>
      <Recettes path="/recettes" />
      <DetailListe path="/recette/new" />
      <DetailRecette path="/recette/:id" />

      <Listes path="/listes" />
      <DetailListe path="/liste/new" />
      <DetailListe path="/liste/:id" />
      <DetailListe path="/liste/recette/:id" />
    </Router>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
