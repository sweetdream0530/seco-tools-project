import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { GET_USER, LOGIN } from "./consts";
import { setUser } from "./actions";
import { SagaAction } from "../common/types";
import { getUserRequest, signInRequest } from "./data";
import { AuthPayload } from "./types";
import { restartConnection } from "..";

export function* authenticateUserWorker({ payload }: SagaAction<AuthPayload>): any {
    const data = yield call(signInRequest, payload);
    if (data) {
        localStorage.setItem("apiKey", data.apiKey);
        localStorage.setItem("showMainPage", "false");
        yield put(setUser());
        restartConnection();
    }
}

export function* onGetUser(): any {
    const data = yield call(getUserRequest());
    if (data) {
        yield put(setUser());
    }
}

export function* authWatcher() {
    yield all([
        takeEvery(LOGIN, authenticateUserWorker),
        takeLatest(GET_USER, onGetUser),
    ]);
}