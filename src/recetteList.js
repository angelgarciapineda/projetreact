import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";

const baseURL = "https://react-19-20.cleverapps.io";

const getRecettes = async () => {
  const resultat = await fetch(`${baseURL}/angel/recettes`);
  const recettes = await resultat.json();
  return recettes;
};

export const Recette = ({ recette }) => {
  return (
    <div className="recette">
      <div className="title">
        {recette.name} | {recette.note}/10
      </div>
      <br />
      <div>{recette.description}</div>
      <Link to={`/recette/${recette.id}`}> Voir détail de la recette</Link>
    </div>
  );
};

const Recettes = () => {
  const [recettes, setRecettes] = useState();

  useEffect(() => {
    getRecettes().then(res => setRecettes(res));
  }, [setRecettes]);

  if (!recettes) return <div>Chargement en cours</div>;

  return (
    <div>
      <h1>Recettes</h1>
      {recettes.map(recette => (
        <Recette key={recette.id} recette={recette} />
      ))}
    </div>
  );
};

export default Recettes;
