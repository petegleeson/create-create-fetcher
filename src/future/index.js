import React from "react";

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

export class Loading extends React.Component {
  state = { isLoading: false };
  componentDidCatch(fetcher) {
    fetcher.then(() => this.setState({ isLoading: false }));
    this.setState({ isLoading: true });
  }
  render() {
    return this.props.children(this.state.isLoading);
  }
}

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
      pendingChildrenState: props.initialState
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
      // render with current state or give up and return null
      return currentChildrenState
        ? children(currentChildrenState, this.deferSetState)
        : null;
    }
  }
}


const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export class Placeholder extends React.Component {
  state = { showPlaceholder: false, loaded: false, error: false };

  componentDidCatch(fetcher) {
    fetcher.then(() => this.setState({
      loaded: true,
    }));
    this.setState({ error: true });
  }

  componentDidMount() {
    delay(this.props.delayMs).then(() =>
      this.setState({ showPlaceholder: true })
    );
  }


  render() {
    const { loaded, showPlaceholder, error } = this.state;

    if (loaded || !error) {
      return this.props.children;
    } else if (showPlaceholder) {
      return this.props.fallback;
    }
    return null;
  }
}
