import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";
const base = "https://react-19-20.cleverapps.io/angel";

const getIngredientsDisponibles = async () => {
  const result = await fetch(`${base}/ingredients`);
  if (!result.ok) {
    throw new Error("erreur lors du chargement des ingredients");
  }
  const ingredients = await result.json();
  return ingredients;
};

const Ingredients = ({ value = [], onChange }) => {
  const [ingredientsDispos, setIngresidentsDispos] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(0);
  const [newQte, setNewQte] = useState(0);

  useEffect(() => {
    getIngredientsDisponibles().then(ingredients => {
      setIngresidentsDispos(ingredients);
    });
  }, []);

  return (
    <div>
      <ul>
        {value.map((ingredient, index) => (
          <li>
            {ingredient.name} {ingredient.qte}{" "}
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
        value={selectedIngredient}
        onChange={event => {
          setSelectedIngredient(event.target.value);
          console.log(event.target.value);
        }}
      >
        <option value={0}>Choix d'ingredient</option>
        {ingredientsDispos.map(ingredient => (
          <option key={ingredient.id} value={ingredient.id}>
            {ingredient.name}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Qte"
        value={newQte}
        onChange={event => setNewQte(event.target.value)}
      />
      <button
        disabled={!newQte || !selectedIngredient}
        onClick={() => {
          const ingredient = ingredientsDispos.find(
            ing => ing.id === selectedIngredient
          );
          const existingIndex = value.findIndex(
            ing => ing.id === ingredient.id
          );

          if (existingIndex === -1) {
            onChange([...value, { ...ingredient, qte: Number(newQte) }]);
          } else {
            onChange(
              value.map(ing => {
                if (ing.id === ingredient.id) {
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
          setSelectedIngredient(0);
        }}
      >
        Ajouter
      </button>
    </div>
  );
};

const getRecette = async id => {
  const resultat = await fetch(`${base}/recettes/${id}`);
  const recette = await resultat.json();
  return recette;
};

const saveRecette = async recette => {
  const result = await fetch(`${base}/recettes/${recette.id}`, {
    method: "PUT",
    body: JSON.stringify(recette),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving");
  }
  return result.json();
};

const CreerRecette = async recette => {
  const result = await fetch(`${base}/recettes`, {
    method: "POST",
    body: JSON.stringify(recette),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving");
  }
  return result.json();
};

const EfacerRecette = async recette => {
  const result = await fetch(`${base}/recettes/{id}`, {
    method: "DELETE",
    body: JSON.stringify(recette),
    headers: {
      "Content-type": "application/json"
    }
  });
  if (!result.ok) {
    throw new Error("Error while saving");
  }
  return result.json();
};

export const DetailRecette = ({ id }) => {
  const [recette, setRecette] = useState();

  useEffect(() => {
    (async () => {
      setRecette(await getRecette(id));
    })();
  }, [id]);

  if (!recette) return <div>Chargement de la recette</div>;

  return (
    <div>
      <h1>Détail de {recette.name}</h1>

      <div>
        <input
          value={recette.name}
          onChange={event =>
            setRecette({
              ...recette,
              name: event.target.value
            })
          }
        />
      </div>
      <div>
        <textarea
          value={recette.description}
          onChange={event =>
            setRecette({
              ...recette,
              description: event.target.value
            })
          }
        />
      </div>
      <div>
        <input
          value={recette.note}
          type="number"
          onChange={event =>
            setRecette({
              ...recette,
              note: event.target.value
            })
          }
        />
      </div>
      <Ingredients
        value={recette.ingredients}
        onChange={ingredients =>
          setRecette({
            ...recette,
            ingredients: ingredients
          })
        }
      />
      <div>
        <button
          onClick={() => {
            saveRecette(recette).then(res => setRecette(res));
          }}
        >
          <Link to={`/listes`}> Sauvegarder les changements </Link>
        </button>
        <button
          onClick={() => {
            CreerRecette(recette);
          }}
        >
          Créer cette recette
        </button>
        <button
          onClick={() => {
            EfacerRecette(recette);
          }}
        >
          Effacer cette recette
        </button>
      </div>
    </div>
  );
};
