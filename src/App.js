import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Loading } from "./future";
import {
  CharacterList,
  PaginatedCharacterList
} from "./starwars/character-list";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Star wars characters</h1>
        </header>
        <PaginatedCharacterList />
      </div>
    );
  }
}

// const App = () => (
//   <Loading>
//     {isLoading => (isLoading ? "Loading..." : <CharacterList page={1} />)}
//   </Loading>
// );

export default App;
