import { createSelector } from "reselect";
import { IApplicationState } from "../types";
import { ITransmormModesState } from "./types";

export const selectSelectedTransformModes = createSelector(
    (state: IApplicationState) => state.transformModes,
    (transformModes: ITransmormModesState) => transformModes.selectedTransformMode,
);
