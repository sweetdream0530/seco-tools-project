import { createSelector } from "reselect";
import { IDataState } from "./types";
import { IApplicationState } from "../types";

export const selectNotifications = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.notifications,
);

export const selectIsLoading = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.loading,
);

export const getConnectionId = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.connectionId,
);

export const isMaterialListEnabled = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.materialListEnabled,
);

export const isToolsSuggestionEnabled = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.suggestionModalEnabled,
);

export const getSelectedFeature = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.selectedFeature,
);


export const isconfigurationWidgetEnabled = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.configurationWidgetEnabled,
);

export const getSettings = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.settings,
);

export const getRecognizeButtonDisabled = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.recognizeButtonDisabled,
);

export const getApiVersions = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.versions,
);

export const getPageNumber = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.pageNumber,
);

export const getToolImageSourceUrl = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.toolImageSourceUrl,
);

export const getCutDataInfo = createSelector(
    (state: IApplicationState) => state.data,
    (data: IDataState) => data.cutDataInfo,
);