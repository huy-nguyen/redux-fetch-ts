import { Middleware } from 'redux';
export interface IFetchAction<BeginActionName extends string, SuccessActionName extends string, FailActionName extends string, State, Result, Payload extends object> {
    types: [BeginActionName, SuccessActionName, FailActionName];
    shouldFetch: (state: State) => boolean;
    payload: Payload;
    __unused?: Result;
    url: string;
}
declare module "redux" {
    interface Dispatch<S> {
        <Begin extends string, Success extends string, Fail extends string, Result, Payload extends object, Return>(fetchAction: IFetchAction<Begin, Success, Fail, S, Result, Payload>): Return;
    }
}
declare let testMiddleware: Middleware;
export default testMiddleware;
