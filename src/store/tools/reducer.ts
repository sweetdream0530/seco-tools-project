/* eslint-disable no-param-reassign */
import produce from "immer";
import { getType } from "typesafe-actions";

import type { Reducer } from "redux";
import type { ActionType } from "typesafe-actions";
import * as actionCreators from "./actions";
import { TOOL_STATE } from "./consts";

import type { IToolsState } from "./types";

const initialState: IToolsState = {
    selectedTool: TOOL_STATE.NAVIGATE,
};

type ToolAction = ActionType<typeof actionCreators>;

// eslint-disable-next-line default-param-last
const reducer: Reducer<IToolsState, ToolAction> = (
    state = initialState,
    action,
) => produce(state, (draft) => {
    switch (action.type) {
    case getType(actionCreators.selectTool): {
        draft.selectedTool = action.payload;
        return;
    }

    default: {
    // eslint-disable-next-line no-useless-return
        return;
    }
    }
});

export default reducer;
