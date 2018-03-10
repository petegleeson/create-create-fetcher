# Create createFetcher

An attempt to mimic [Suspense](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html) with React 16.2.

## Why

For learning and programming gymnastics 🤸‍♂️

## Usage

**Do not really use this.**

This example is lifted from `./src/starwars/character-list.js`

```js
const characterFetcher = createFetcher(page =>
  delay(1000)
    .then(() => fetch(`https://swapi.co/api/people/?page=${page}`))
    .then(resp => resp.json())
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
```

## Explaination

The `DeferredState` component handles async state changes. It holds state
that is passed to a fetcher's `read` method.

The `defaultState` prop is used specify the initial async state.

The children of `DeferredState` is a function with two arguments. The first
is the current state. The second is the `deferSetState` method. This method
is used to change the state that `DeferredState` holds.

#### That's it 😃
