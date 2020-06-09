import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { navigate } from "@reach/router";

const baseURL = "https://react-19-20.cleverapps.io/thibaut";

/*
 * RECETTE
 */

const getRecettesDisponibles = async () => {
  const result = await fetch(`${baseURL}/recettes`);
  const recettes = await result.json();
  return recettes;
};

const Recettes = ({ value = [], onChange }) => {
  const [recettesDispos, setRecettesDispos] = useState([]);
  const [selectedRecette, setSelectedRecette] = useState(0);

  useEffect(() => {
    getRecettesDisponibles().then(recettes => {
      setRecettesDispos(recettes);
    });
  }, []);

  return (
    <div>
      <ul>
        {value.map((recette, index) => (
          <li>
            {recette.name}{" "}
            <button
              onClick={() => {
                onChange(
                  value
                    .slice(0, index)
                    .concat(value.slice(index + 1, value.length))
                );
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <select
        value={selectedRecette}
        onChange={event => {
          setSelectedRecette(event.target.value);
          console.log(event.target.value);
        }}
      >
        <option value={0}>Choix de recette</option>
        {recettesDispos.map(recette => (
          <option key={recette.id} value={recette.id}>
            {recette.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          const recette = recettesDispos.find(
            rec => rec.id === selectedRecette
          );
          const existingIndex = value.findIndex(rec => rec.id === recette.id);

          if (existingIndex === -1) {
            onChange([...value, { ...recette }]);
          } else {
            onChange(
              value.map(rec => {
                if (rec.id === recette.id) {
                  return {
                    ...rec
                  };
                } else {
                  return rec;
                }
              })
            );
          }
          setSelectedRecette(0);
        }}
      >
        Ajouter
      </button>
    </div>
  );
};

const ListeIngredients = ({ value = [], onChange }) => {
  const [currentIngredients, setCurrentIngredients] = useState([]);

  return (
    <div>
      <ul>
        {value.map((recette, index) =>
          recette.ingredients.map((ingredient, index) => {
            const existingIndex = recette.ingredients.findIndex(
              ing => ing.id === ingredient.id
            );

            if (existingIndex === -1) {
            } else {
              return (
                <li>
                  {" "}
                  {ingredient.name} {ingredient.qte}{" "}
                </li>
              );
            }
          })
        )}
      </ul>
    </div>
  );
};

/*
 * LISTE
 */

const createListe = async liste => {
  const result = await fetch(`${baseURL}/listes`, {
    method: "POST",
    body: JSON.stringify(liste),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while creating new list");
  }
  return result.json();
};

const saveListe = async liste => {
  const result = await fetch(`${baseURL}/listes/${liste.id}`, {
    method: "PUT",
    body: JSON.stringify(liste),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving list");
  }
  return result.json();
};

const getListe = async id => {
  const resultat = await fetch(`${baseURL}/listes/${id}`);
  const liste = await resultat.json();
  return liste;
};

export const DetailListe = ({ id }) => {
  const [liste, setListe] = useState();

  useEffect(() => {
    (async () => {
      if (id) {
        setListe(await getListe(id));
      } else {
        setListe({ name: "Nouvelle liste" });
      }
    })();
  }, [id]);

  if (!liste) return <div>Chargement de la liste</div>;

  return (
    <div>
      <Link to={`/listes`}>Retour à la liste de course</Link>
      <div>
        <h1>{liste.name}</h1>
        <input
          value={liste.name}
          onChange={event => setListe({ ...liste, name: event.target.value })}
        />
      </div>
      <div>
        <h1>Recettes</h1>
        <Recettes
          value={liste.recettes}
          onChange={recettes => setListe({ ...liste, recettes: recettes })}
        />
      </div>
      <div>
        <h1>Ingrédients</h1>
        <ListeIngredients value={liste.recettes} />
      </div>
      <button
        onClick={() => {
          if (id) {
            saveListe(liste).then(res => setListe(res));
          } else {
            createListe(liste).then(res => {
              navigate(`/liste/${res.id}`);
            });
          }
        }}
      >
        Sauvegarder liste
      </button>
    </div>
  );
};
