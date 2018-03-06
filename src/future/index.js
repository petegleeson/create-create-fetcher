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

export class DeferredState extends React.Component {
  constructor(props) {
    super(props);
    this.state = { childrenState: props.state };
  }

  componentDidCatch(error) {
    // Display fallback UI
    error.then(() =>
      this.setState({
        childrenState: this.state.pendingChildrenState,
        pendingChildrenState: undefined
      })
    );
  }

  deferSetState(childrenState) {
    this.setState({ pendingChildrenState: childrenState });
  }

  render() {
    const { childrenState } = this.state;
    return this.props.children(this.state.childrenState, this.deferSetState);
  }
}

// ASYNC HOC
// read always throws with fetcher and args,
// async component catches and exectues fetcher,
// re-renders once fetcher has resolved

// problem is how does 'read' now know that the
// promise is resolved?

export class Defer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: false };
  }

  componentDidCatch(error) {
    // Display fallback UI
    this.setState({ isFetching: true });
    error.then(() => this.setState({ isFetching: false }));
  }

  render() {
    return this.state.isFetching ? null : this.props.children;
  }
}

// ASYNC COMPONENT

// type Props = {
//   createFetcher: Fetcher,
//   children: <T>(value: T) => Node
// };

// type State = {
//   loaded: boolean
// };

// export class Async extends React.Component<Props, State> {
//   componentDidMount() {
//     if (!this.state.loaded) {
//     }
//   }
//   render() {}
// }
