import { createSelector } from "reselect";
import { IAuthState } from "./types";
import { IApplicationState } from "../types";

export const selectIsUserLoggedIn = createSelector(
    (state: IApplicationState) => state.auth,
    (data: IAuthState) => data.isUserLoggedIn,
);
