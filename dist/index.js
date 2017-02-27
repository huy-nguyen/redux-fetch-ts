import * as tslib_1 from "tslib";
const isResponseSuccessful = (response) => (response.status >= 200 && response.status < 300);
let testMiddleware = ({ dispatch, getState }) => (next) => (fetchAction) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    if (fetchAction.types) {
        const { types, shouldFetch, url, payload } = fetchAction;
        const [beginAction, successAction, failAction] = types;
        if (shouldFetch(getState())) {
            dispatch({ type: beginAction, payload: payload });
            try {
                const response = yield fetch(url);
                if (isResponseSuccessful(response)) {
                    const data = yield response.json();
                    dispatch({
                        type: successAction,
                        payload: Object.assign({ data }, payload),
                    });
                }
                else {
                    throw response.statusText;
                }
            }
            catch (err) {
                dispatch({ type: failAction });
            }
        }
        else {
            return;
        }
    }
    else {
        return next(fetchAction);
    }
});
export default testMiddleware;
//# sourceMappingURL=index.js.map