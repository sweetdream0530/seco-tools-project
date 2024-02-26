import { createSelector } from "reselect";
import { IApplicationState } from "../types";
import { IToolsState } from "./types";

export const selectSelectedTool = createSelector(
    (state: IApplicationState) => state.tools,
    (tools: IToolsState) => tools.selectedTool,
);
