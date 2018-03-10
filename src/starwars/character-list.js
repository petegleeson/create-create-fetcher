import React, { Fragment } from "react";
import { createFetcher, DeferredState } from "../future";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const characterFetcher = createFetcher(page =>
  delay(1000)
    .then(() => fetch(`https://swapi.co/api/people/?page=${page}`))
    .then(resp => resp.json())
);

export const List = ({ characters }) => (
  <ul>{characters.map(({ name }) => <li key={name}>{name}</li>)}</ul>
);

export const CharacterList = ({ page }) => {
  const { results } = characterFetcher.read(page);
  return <List characters={results} />;
};

const Pagination = ({ hasPrevious, hasNext, onPrevious, onNext }) => (
  <Fragment>
    <button disabled={!hasPrevious} onClick={onPrevious}>
      Previous page
    </button>
    <button disabled={!hasNext} onClick={onNext}>
      Next page
    </button>
  </Fragment>
);

export const PaginatedCharacterList = () => (
  <DeferredState initialState={{ page: 1 }}>
    {({ page }, deferSetState) => {
      const { results, next, previous } = characterFetcher.read(page);
      return (
        <Fragment>
          <List characters={results} />
          <Pagination
            hasPrevious={previous}
            hasNext={next}
            onPrevious={() => deferSetState({ page: page - 1 })}
            onNext={() => deferSetState({ page: page + 1 })}
          />
        </Fragment>
      );
    }}
  </DeferredState>
);
