import produce from "immer";
import { getType } from "typesafe-actions";

import type { Reducer } from "redux";
import type { ActionType } from "typesafe-actions";
import * as actionCreators from "./actions";

import { TRANSFORM_MODE } from "./consts";

import type { ITransmormModesState } from "./types";

const initialState: ITransmormModesState = {
    selectedTransformMode: TRANSFORM_MODE.NONE,
};

type TransmormModesAction = ActionType<typeof actionCreators>;

// eslint-disable-next-line default-param-last
const reducer: Reducer<ITransmormModesState, TransmormModesAction> = (
    state = initialState,
    action,
) => produce(state, (draft) => {
    switch (action.type) {
    case getType(actionCreators.transformPanelTool): {
    // eslint-disable-next-line no-param-reassign
        draft.selectedTransformMode = action.payload;
        // eslint-disable-next-line no-useless-return
        return;
    }
    default: {
    // eslint-disable-next-line no-useless-return
        return;
    }
    }
});

export default reducer;
