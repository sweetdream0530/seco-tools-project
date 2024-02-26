import { createAction } from "typesafe-actions";
import { LOGIN, SET_USER, IS_USER_LOGGED_IN, GET_USER } from "./consts";
import { AuthPayload } from "./types";

export const login = createAction(LOGIN)<AuthPayload>();

export const setUser = createAction(SET_USER)();
export const getUser = createAction(GET_USER)();

export const isUserLoggedIn = createAction(IS_USER_LOGGED_IN)<string>();