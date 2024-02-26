import { createAction } from "typesafe-actions";

import { SELECT_TOOL } from "./consts";

export const selectTool = createAction(SELECT_TOOL)<string>();
