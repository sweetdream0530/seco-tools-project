import { all } from "redux-saga/effects";
import { authWatcher } from "./auth/saga";
import model from "./model/saga";

export default function* root() {
    yield all([model(), authWatcher()]);
}
