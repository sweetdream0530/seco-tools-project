import { applyMiddleware, createStore } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import { composeWithDevTools } from "redux-devtools-extension";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import { createBrowserHistory } from "history";
import sagas from "./sagas";
import createRootReducer from "./reducers";
import { IApplicationState } from "./types";
import { connection } from "./api/signalRInstance";
import { setConnectionId } from "./data/actions";
import { loadFeatures, updateModel } from "./model/actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mergeOrInvalidateStateReconciler: any = (
    inboundState: { user: { version: string } | null },
    originalState: IApplicationState,
    reducedState: IApplicationState
) => {
    if (
        inboundState.user &&
    window.location.search.substring(1) !== "logout" &&
    process.env.REACT_APP_VERSION === inboundState.user.version
    ) {
        return autoMergeLevel1(
            inboundState,
            originalState,
            reducedState,
            persistConfig
        );
    }

    console.info("App version changed: Purging redux-persist state");
    return originalState;
};

const persistConfig = {
    key: "root",
    storage,
    stateReconciler: mergeOrInvalidateStateReconciler,
};

/* ------------- History config ---------------*/

const history = createBrowserHistory();

/* ------------- Redux Configuration ------------- */

const rootReducer = createRootReducer(history);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const middleware: any[] = [];
const enhancers = [];

/* ------------- Saga Middleware ------------- */

const sagaMiddleware = createSagaMiddleware();
middleware.push(sagaMiddleware);
// middleware.push(thunk);

/* ------------- Assemble Middleware ------------- */

enhancers.push(applyMiddleware(...middleware));

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = createStore(persistedReducer, composeWithDevTools(...enhancers));
const persistor = persistStore(store);

// Kick off root sagas
sagaMiddleware.run(sagas);

connection.on("Features", (modelName, data) => {
    const { settings } = store.getState().data;
    store.dispatch(loadFeatures({features: data, settings}));
});
connection.on("Model", (modelName, data) => {
    store.dispatch(updateModel(data));
});

const restartConnection = () => {
    connection.stop().then(() => {
        connection.start().then(() => {
            connection.invoke("getConnectionId").then((connectionId) => {
                // Set the connectionId to state
                store.dispatch(setConnectionId(connectionId));
            });
        });
    });
};

restartConnection();

export { store, persistor, history, restartConnection };
