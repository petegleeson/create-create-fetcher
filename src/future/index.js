import React from "react";

// type Fetcher = <T>(...args: Array<any>) => Promise<T>;

export const createFetcher = fetcher => {
  let cache = {};
  return {
    read: (...args) => {
      if (cache[args] === undefined) {
        throw fetcher(args).then(v => (cache[args] = v));
      } else {
        return cache[args];
      }
    }
  };
};

// steps:
// 1. render state A
// 2. deferSetState called with A'
// 3. render state A'
// 4. catch error from A' render
// 5. render state A
// 6. data for A' resolves
// 7. render state A'
export class DeferredState extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentChildrenState: undefined,
      pendingChildrenState: props.defaultState
    };
  }

  // arrow function is important
  deferSetState = pendingChildrenState =>
    this.setState({
      pendingChildrenState
    });

  render() {
    const { children } = this.props;
    const { currentChildrenState, pendingChildrenState } = this.state;
    try {
      // always try render with pending state if we have one
      return children(
        pendingChildrenState || currentChildrenState,
        this.deferSetState
      );
    } catch (fetcher) {
      // tried to render before data available,
      // when the fetch resolves, commit pending children state
      fetcher.then(() => {
        this.setState({
          currentChildrenState: this.state.pendingChildrenState,
          pendingChildrenState: undefined
        });
      });
      // use render with current state or give up and return null
      return currentChildrenState
        ? children(currentChildrenState, this.deferSetState)
        : null;
    }
  }
}
