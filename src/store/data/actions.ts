import { createAction } from "typesafe-actions";
import { INotification } from "../common/types";
import {
    CLOSE_NOTIFICATION,
    CLOSE_SUGGESTION_MODAL,
    DISABLE_RECOGNIZE_BUTTON,
    ENABLE_RECOGNIZE_BUTTON,
    LOADING, LOADING_DONE, LOAD_API_VERSION, LOAD_DEFAULT_SETTINGS, OPEN_MATERIAL_LIST, PUSH_NOTIFICATION, RESET_DATA_STATE, SET_API_VERSION, SET_CONNECTION_ID, SET_DEFAULT_SETTINGS, SET_SETTINGS_FROM_SERVER, SHOW_SUGGESTION_MODAL, TOGGLE_CONFIGURATION_WIDGET,
    SET_PAGE_NUMBER,
    SET_TOOL_IMAGE_SOURCE_URL,
    SET_CUT_DATA_INFO,
} from "./consts";
import { IFeature } from "../model/types";
import { ISettings } from "./types";

export const pushNotification = createAction(PUSH_NOTIFICATION)<INotification>();

export const closeNotification = createAction(CLOSE_NOTIFICATION)<string>();

export const loading = createAction(LOADING)();
export const loadingDone = createAction(LOADING_DONE)();

export const setConnectionId = createAction(SET_CONNECTION_ID)<string>();

export const openMaterialsList = createAction(OPEN_MATERIAL_LIST)();

export const showSuggestionModal = createAction(SHOW_SUGGESTION_MODAL)<IFeature>();
export const closeSuggestionModal = createAction(CLOSE_SUGGESTION_MODAL)();

export const toggleConfigurationWidget = createAction(TOGGLE_CONFIGURATION_WIDGET)<boolean>();

export const resetDataState = createAction(RESET_DATA_STATE)();

export const loadSettings = createAction(LOAD_DEFAULT_SETTINGS)();
export const setSettings = createAction(SET_DEFAULT_SETTINGS)<ISettings>();
export const setSettingsFromServer = createAction(SET_SETTINGS_FROM_SERVER)<ISettings>();

export const loadApiVersion = createAction(LOAD_API_VERSION)();
export const setApiVersion = createAction(SET_API_VERSION)<string>();

export const disableRecognizeButton = createAction(DISABLE_RECOGNIZE_BUTTON)();
export const enableRecognizeButton = createAction(ENABLE_RECOGNIZE_BUTTON)();

export const setPageNumber = createAction(SET_PAGE_NUMBER)<number>();

export const setToolImageSourceUrl = createAction(SET_TOOL_IMAGE_SOURCE_URL)<any>();

export const setCutDataInfo = createAction(SET_CUT_DATA_INFO)<any>();