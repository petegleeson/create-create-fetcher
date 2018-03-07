import React, { Fragment } from "react";
import { createFetcher, DeferredState } from "../future";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const characterFetcher = createFetcher(page =>
  delay(1000)
    .then(() => fetch(`https://swapi.co/api/people/?page=${page}`))
    .then(resp => resp.json())
);

const CharacterList = () => (
  <DeferredState defaultState={{ page: 1 }}>
    {({ page }, deferSetState) => {
      const { results, next, previous } = characterFetcher.read(page);
      return (
        <Fragment>
          <ul>{results.map(({ name }) => <li key={name}>{name}</li>)}</ul>
          <button
            disabled={!previous}
            onClick={() => deferSetState({ page: page - 1 })}
          >
            Previous page
          </button>
          <button
            disabled={!next}
            onClick={() => deferSetState({ page: page + 1 })}
          >
            Next page
          </button>
        </Fragment>
      );
    }}
  </DeferredState>
);

export default CharacterList;
