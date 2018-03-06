import React, { Fragment } from "react";
import { createFetcher } from "../future";

const characterFetcher = createFetcher(page =>
  fetch(`https://swapi.co/api/people/?page=${page}`).then(resp => resp.json())
);

class CharacterList extends React.Component {
  constructor() {
    super();
    this.state = { page: 1 };
  }

  render() {
    const { page } = this.state;
    const { results } = characterFetcher.read(page);
    return (
      <Fragment>
        <ul>{results.map(({ name }) => <li key={name}>{name}</li>)}</ul>
        <button
          disabled={page === 1}
          onClick={() => this.setState({ page: page - 1 })}
        >
          Previous
        </button>
        <button onClick={() => this.setState({ page: page + 1 })}>Next</button>
      </Fragment>
    );
  }
}

export default CharacterList;
