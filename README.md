This package is a TypeScript port of the `callAPIMiddleware` shown [here](http://redux.js.org/docs/recipes/ReducingBoilerplate.html#async-action-creators).

The new action type `IFetchAction` has the following properties:

- `types` lists the three actions to be emitted when the fetching begins, succeeds and fails.

- `shouldFetch` is a predicate function that determines whether a fetch should happen based on the Redux store.

- `payload`: information that will be emitted along with the "begin" and "success" actions.

- `url`: the URL to fetch from.
