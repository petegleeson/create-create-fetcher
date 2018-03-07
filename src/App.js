import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import CharacterList from "./starwars/character-list";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Starwars characters</h1>
        </header>
        <CharacterList />
      </div>
    );
  }
}

export default App;
