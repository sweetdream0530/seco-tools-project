import { createAction } from "typesafe-actions";

import { TRANSFORM_PANEL_TOOL } from "./consts";

export const transformPanelTool = createAction(TRANSFORM_PANEL_TOOL)<string>();
