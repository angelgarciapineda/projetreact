import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
import { navigate } from "@reach/router";
const base = "https://react-19-20.cleverapps.io/angel";

const getRecettesDisponibles = async () => {
  const result = await fetch(`${base}/recettes`);
  /*   if (!result.ok) {
    throw new Error("erreur lors du chargement des recetttes");
  } */
  const recettes = await result.json();

  return recettes;
};

const getAllIngredients = recettes => {
  if (!recettes) return [];

  let allIngredients = [];
  recettes.forEach(recette => {
    recette.ingredients.forEach(ingredient => {
      const ingTemp = allIngredients.find(ing => ing.id === ingredient.id);
      if (ingTemp) {
        ingTemp.qte += ingredient.qte;
      } else {
        allIngredients.push({
          id: ingredient.id,
          name: ingredient.name,
          qte: ingredient.qte
        });
      }
    });
  });

  return allIngredients;
};

const Recettes = ({ value = [], onChange }) => {
  const [RecettesDispo, setRecettesDispo] = useState([]);
  const [selectedRecette, setSelectedRecette] = useState(0);
  const [newQte, setNewQte] = useState(0);

  useEffect(() => {
    getRecettesDisponibles().then(recettes => {
      setRecettesDispo(recettes);
    });
  }, []);

  return (
    <div>
      <ul>
        {value.map((recette, index) => (
          <li key={recette.id}>
            <Link to={`/recette/${recette.id}`}>{recette.name} </Link>

            <button
              onClick={() => {
                onChange(
                  value
                    .slice(0, index)
                    .concat(value.slice(index + 1, value.length))
                );
              }}
            >
              Supprimer
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
        <option value={0}>Choix des recettes</option>
        {RecettesDispo.map(recette => (
          <option key={recette.id} value={recette.id}>
            {recette.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Qte"
        value={newQte}
        onChange={event => setNewQte(event.target.value)}
      />
      <br />
      <button
        disabled={!newQte || !selectedRecette}
        onClick={() => {
          const recette = RecettesDispo.find(ing => ing.id === selectedRecette);
          const existingIndex = value.findIndex(ing => ing.id === recette.id);

          if (existingIndex === -1) {
            onChange([...value, { ...recette, qte: Number(newQte) }]);
          } else {
            onChange(
              value.map(ing => {
                if (ing.id === recette.id) {
                  return {
                    ...ing,
                    qte: Number(newQte) + ing.qte
                  };
                } else {
                  return ing;
                }
              })
            );
          }
          setNewQte(0);
          setSelectedRecette(0);
        }}
      >
        Ajouter
      </button>
    </div>
  );
};

const getListe = async id => {
  const resultat = await fetch(`${base}/listes/${id}`);
  const liste = await resultat.json();
  return liste;
};

const saveListe = async liste => {
  const result = await fetch(`${base}/listes/${liste.id}`, {
    method: "PUT",
    body: JSON.stringify(liste),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving");
  }
  return result.json();
};

const CreateListe = async liste => {
  const result = await fetch(`${base}/listes`, {
    method: "POST",
    body: JSON.stringify(liste),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving");
  }
  return result.json();
};

/*liste
 ************/

/*const Ingredients = ({ value = [], onChange }) => {
  const [getIngredients, setIngredients] = useState([]);

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
};*/

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

  if (!liste) return <div>Chargement de la recette</div>;

  return (
    <div>
      <h1>Détail de {liste.name}</h1>

      <div>
        <input
          value={liste.name}
          onChange={event =>
            setListe({
              ...liste,
              name: event.target.value
            })
          }
        />
      </div>
      <div>
        <textarea
          value={liste.description}
          onChange={event =>
            setListe({
              ...liste,
              description: event.target.value
            })
          }
        />
      </div>
      <div>
        <input
          value={liste.note}
          type="number"
          onChange={event =>
            setListe({
              ...liste,
              note: event.target.value
            })
          }
        />
      </div>
      <Recettes
        value={liste.recettes}
        onChange={recettes =>
          setListe({
            ...liste,
            recettes: recettes
          })
        }
      />
      <div>
        <div>Les ingredients:</div>
        {getAllIngredients(liste.recettes).map(ingredient => (
          <li>
            {ingredient.name} {ingredient.qte}
          </li>
        ))}
        {/*  <div>
          <h3>Ingrédients</h3>
          <Ingredients value={liste.recettes} />
        </div>
        */}
        <button
          onClick={() => {
            if (id) {
              saveListe(liste).then(res => setListe(res));
            } else {
              CreateListe(liste).then(res => {
                navigate(`/liste/${res.id}`);
              });
            }
          }}
        >
          Sauvegarder les changements
        </button>
        <br />
        <button
          onClick={() => {
            CreateListe(liste);
          }}
        >
          Créer cette liste
        </button>
      </div>
    </div>
  );
};
