import { createSelector } from "reselect";
import { IModelState } from "./types";
import { IApplicationState } from "../types";

export const selectFeatureRecognizeData = createSelector(
    (state: IApplicationState) => state.model,
    ({
        recognitionAvailable, model, originModel, modelName,
    }: IModelState) => ({
        recognitionAvailable, recognitionEnabled: !!model, model, originModel, modelName,
    }),
);

export const getModelName = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.modelName,
);

export const getFeaturesByAxes = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.featuresByAxes,
);

export const getModelSize = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.modelSize,
);

export const getSelectedFeatureHash = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.selectedFeatureHash,
);

export const getSelectedFeature = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.selectedFeature,
);

export const getSelectAxes = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.selectedAxes,
);

export const getSelectedMaterial = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.material,
);

export const getToolsCount = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.toolsCount,
);

export const getBlank = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.blank,
);

export const isBlankEnabled = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.blank.enabled
);

export const getCancelTokenSource = createSelector(
    (state: IApplicationState) => state.model,
    (data: IModelState) => data.cancelTokenSource
);