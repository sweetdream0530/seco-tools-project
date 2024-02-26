import produce from "immer";

import { ActionType, Reducer, getType } from "typesafe-actions";
import * as actionCreators from "./actions";
import { IDataState, ISettings } from "./types";
import { INotification } from "../common/types";

type DataAction = ActionType<typeof actionCreators>;

const siteSettings = {
    groupSimilarFeatures: true
};

const initialState: IDataState = {
    notifications: {},
    loading: false,
    materialListEnabled: false,
    suggestionModalEnabled: false,
    selectedFeature: undefined,
    configurationWidgetEnabled: false,
    settings: { ...siteSettings, ...JSON.parse(localStorage.getItem("settings") ?? "{}")},
    versions: {},
    recognizeButtonDisabled: false,
    pageNumber: 1,
    toolImageSourceUrl: {},
    cutDataInfo: [],
};

// eslint-disable-next-line default-param-last
const reducer: Reducer<IDataState, DataAction> = (
    state = initialState,
    action,
) => produce(state, (draft: IDataState) => {
    switch (action.type) {
    case getType(actionCreators.pushNotification): {
        const id = Date.now().toString();
        const notificationData = action.payload as INotification;
        draft.notifications[id] = {...notificationData, id };
        return;
    }

    case getType(actionCreators.closeNotification): {
        const id = action.payload as string;
        if (id in draft.notifications) {
            delete draft.notifications[id];
        }
        return;
    }

    case getType(actionCreators.loading): {
        draft.loading = true;
        return;
    }
    
    case getType(actionCreators.loadingDone): {
        draft.loading = false;
        return;
    }

    case getType(actionCreators.setConnectionId): {
        const id = action.payload as string;
        draft.connectionId = id;
        return;
    }

    case getType(actionCreators.openMaterialsList): {
        draft.materialListEnabled = true;
        return;
    }

    case getType(actionCreators.showSuggestionModal): {
        draft.suggestionModalEnabled = true;
        draft.selectedFeature = action.payload;
        return;
    }

    case getType(actionCreators.closeSuggestionModal): {
        draft.suggestionModalEnabled = false;
        return;
    }

    case getType(actionCreators.toggleConfigurationWidget): {
        draft.configurationWidgetEnabled = action.payload;
        return;
    }

    case getType(actionCreators.resetDataState): {
        draft = initialState;
        return;
    }

    case getType(actionCreators.setSettingsFromServer): {
        const serverSettings = action.payload as ISettings;
        const settings = { ...siteSettings, ...serverSettings };
        const tmpSettings = {} as any;
        Object.entries(settings).map(([key, value]) => {
            if (key in draft.settings) {
                tmpSettings[key] = draft.settings[key] as boolean;
            }
            else {
                tmpSettings[key] = value;
            }
        });
        draft.settings = tmpSettings;
        localStorage.setItem("settings", JSON.stringify(draft.settings));
        return;
    }

    case getType(actionCreators.setSettings): {
        draft.settings = action.payload as ISettings;
        const serverSettings = JSON.parse(localStorage.getItem("settings") ?? "{}");
        const settings = { ...siteSettings, ...serverSettings };
        Object.entries(settings).map(([key, value]) => {
            if (!(key in draft.settings)) {
                draft.settings[key] = value as boolean;
            }
        });

        localStorage.setItem("settings", JSON.stringify(draft.settings));
        return;
    }

    case getType(actionCreators.setApiVersion): {
        const { api, recognizer } = action.payload as any;
        draft.versions["api"] = api ?? "";
        draft.versions["recognizer"] = recognizer ?? "";
        return;
    }

    case getType(actionCreators.disableRecognizeButton): {
        draft.recognizeButtonDisabled = true;
        return;
    }

    case getType(actionCreators.enableRecognizeButton): {
        draft.recognizeButtonDisabled = false;
        return;
    }
    
    case getType(actionCreators.setPageNumber): {
        const id = action.payload;
        draft.pageNumber = id;
        return;
    }

    case getType(actionCreators.setToolImageSourceUrl): {
        const id = action.payload;
        draft.toolImageSourceUrl = id;
        return;
    }

    case getType(actionCreators.setCutDataInfo): {
        draft.cutDataInfo = action.payload;
        return ;
    }

    default:
        // eslint-disable-next-line no-useless-return
        return;
    }
});

export default reducer;
