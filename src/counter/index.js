import React from "react";

class Counter extends React.Component {
  state = { counter: 0 };
  render() {
    const { counter } = this.state;
    return (
      <React.Fragment>
        <p>{`Counter: ${counter}`}</p>
        <span>
          <button onClick={() => this.setState({ counter: counter + 1 })}>
            +
          </button>
          <button onClick={() => this.setState({ counter: counter - 1 })}>
            -
          </button>
        </span>
      </React.Fragment>
    );
  }
}

export default Counter;
