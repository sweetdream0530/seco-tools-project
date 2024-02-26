import produce from "immer";

import { ActionType, Reducer, getType } from "typesafe-actions";
import * as actionCreators from "./actions";
import { IAuthState } from "./types";

type DataAction = ActionType<typeof actionCreators>;

const initialState: IAuthState = {
    isUserLoggedIn: false,
};

// eslint-disable-next-line default-param-last
const reducer: Reducer<IAuthState, DataAction> = (
    state = initialState,
    action
) =>
    produce(state, (draft: IAuthState) => {
        switch (action.type) {
        case getType(actionCreators.setUser): {
            draft.isUserLoggedIn = true;
            return;
        }
        default:
            return state;
        }
    });

export default reducer;
