import { connectRouter } from "connected-react-router";
import { History } from "history";
import { combineReducers } from "redux";
import { enableMapSet } from "immer";
import data from "./data/reducer";
import tools from "./tools/reducer";
import model from "./model/reducer";
import auth from "./auth/reducer";
import transformModes from "./transformModes/reducer";

enableMapSet();

export default (history: History) =>
    combineReducers({
        router: connectRouter(history),
        data,
        tools,
        model,
        transformModes,
        auth,
    });
