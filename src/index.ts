import {
  MiddlewareAPI,
  Middleware,
  Dispatch,
} from 'redux';
export interface IFetchAction<
  BeginActionName extends string,
  SuccessActionName extends string,
  FailActionName extends string,
  State,
  Result,
  Payload extends object> {

  types: [BeginActionName, SuccessActionName, FailActionName],
  shouldFetch: (state: State) => boolean,
  payload: Payload,
  __unused?: Result,
  url: string
}

declare module "redux" {
  export interface Dispatch<S> {
    <Begin extends string, Success extends string, Fail extends string, Result, Payload extends object, Return>(fetchAction: IFetchAction<Begin, Success, Fail, S, Result, Payload>): Return
  }
}

const isResponseSuccessful = (response: Response) => (response.status >= 200 && response.status < 300);

let testMiddleware: Middleware =
  <State>({dispatch, getState}: MiddlewareAPI<State>) =>
    (next: Dispatch<State>) =>
      async <BeginActionName extends string, SuccessActionName extends string, FailActionName extends string, Result, Payload extends object>
        (fetchAction: IFetchAction<BeginActionName, SuccessActionName, FailActionName, State, Result, Payload>) => {


  if (fetchAction.types) {
    const {types, shouldFetch, url, payload} = fetchAction;
    const [beginAction, successAction, failAction] = types;
    interface IBeginAction {
      type: typeof beginAction
      payload: Payload
    }
    type ISuccessPayload = {data: Result} & Payload
    interface ISuccessAction {
      type: typeof successAction,
      payload: ISuccessPayload
    }
    interface IFailAction {
      type:  typeof failAction
    }


    if (shouldFetch(getState())) {
      dispatch<IBeginAction>({type: beginAction, payload: payload});
      try {
        const response: Response = await fetch(url);
        if (isResponseSuccessful(response)) {
          const data: Result = await response.json();
          dispatch<ISuccessAction>({
            type: successAction,
            // TODO: use object spread i.e. payload: {...extra, data}
            // when this is fixed: https://github.com/Microsoft/TypeScript/issues/10727
            payload: Object.assign({data}, payload),
          })
        } else {
          throw response.statusText;
        }
      } catch(err) {
        dispatch<IFailAction>({type: failAction})
      }
    } else {
      return;
    }
  } else {
    return next(fetchAction)
  }
}
export default testMiddleware;
