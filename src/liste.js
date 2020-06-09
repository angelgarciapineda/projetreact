import React, { useState, useEffect } from "react";
import { Link } from "@reach/router";

//import { functionTypeAnnotation } from "@babel/types";

const baseURL = "https://react-19-20.cleverapps.io";

const getListes = async () => {
  const resultat = await fetch(`${baseURL}/angel/listes`);
  const listes = await resultat.json();
  return listes;
};

export const Liste = ({ liste }) => {
  return (
    <div className="liste">
      <div className="title">{liste.name} </div>
      <div>{liste.description}</div>
      <Link to={`/liste/${liste.id}`}> Voir détail de la liste</Link>
    </div>
  );
};

const Listes = () => {
  const [listes, setListes] = useState();

  useEffect(() => {
    getListes().then(res => setListes(res));
  }, [setListes]);

  if (!listes) return <div>Chargement en cours</div>;

  return (
    <div>
      <h1>Listes</h1>

      <div className="scrollbar" id="style-1">
        <div className="force-overflow">
          {listes.map(liste => (
            <Liste key={liste.id} liste={liste} />
          ))}
        </div>
      </div>

      <Link to={`/liste/new`}>Nueva Lista</Link>
    </div>
  );
};

export default Listes;
