import { createAction } from "typesafe-actions";
import { Vector3 } from "three";
import { CancelTokenSource } from "axios";
import { AxesFeatures } from "./types";
import {
    GENERATE_PREVIEW_MODEL,
    LOAD_FEATURES,
    PREVIEW_LOADING_DONE,
    RECOGNIZE_FEATURES,
    RESET_MODEL_STATE,
    SELECT_FEATURE,
    SET_MATERIAL,
    SET_MODEL,
    SET_MODEL_SIZE,
    SET_SELECTED_AXES,
    TOGGLE_BLANK,
    TOGGLE_FEATURES_BY_AXIS,
    TOGGLE_GROUP,
    TOOLS_LOADING,
    TOOLS_LOADING_DONE,
    UPDATE_BLANK,
    UPDATE_MODEL,
    SET_CANCEL_TOKEN_SOURCE,
    RESET_CANCEL_TOKEN_SOURCE,
    RECOGNIZE_FEATURES_CANCEL,
    SET_FEATURES_BY_AXES_DATA,
    RESET_FEATURES_BY_AXES,
    LOAD_FEATURE_PARAMETER,
    SET_FEATURE_PARAMETERS,
} from "./consts";
import { Blank, Direction, IMaterialPayload, IModelPayload, ITooglePayload } from "./types";

export const setModel = createAction(SET_MODEL)<IModelPayload>();
export const recognizeFeatures =
    createAction(RECOGNIZE_FEATURES)<IModelPayload>();

export const recognizeFeaturesCancel = createAction(
    RECOGNIZE_FEATURES_CANCEL
)<void>();

export const setCancelTokenSource = createAction(
    SET_CANCEL_TOKEN_SOURCE
)<CancelTokenSource>();

export const resetCancelTokenSource = createAction(
    RESET_CANCEL_TOKEN_SOURCE
)<void>();

export const generatePreviewModel = createAction(
    GENERATE_PREVIEW_MODEL
)<IModelPayload>();
export const previewLoadingDone =
    createAction(PREVIEW_LOADING_DONE)<IModelPayload>();

export const updateModel = createAction(UPDATE_MODEL)<
    string | ArrayBuffer | null
>();
export const loadFeatures = createAction(LOAD_FEATURES)<any>();

export const setModelSize = createAction(SET_MODEL_SIZE)<Vector3>();

export const setSelectedAxes =
    createAction(SET_SELECTED_AXES)<Array<Array<number>>>();

export const setMaterial = createAction(SET_MATERIAL)<
    IMaterialPayload | null | undefined
>();

export const selectFeature = createAction(SELECT_FEATURE)<string | undefined>();

export const toolsLoading = createAction(TOOLS_LOADING)();
export const toolsLoadingDone = createAction(TOOLS_LOADING_DONE)<string>();

export const resetModelState = createAction(RESET_MODEL_STATE)();

export const toggleFeaturesByAxis = createAction(TOGGLE_FEATURES_BY_AXIS)<
    Direction | string
>();

export const toggleGroup = createAction(TOGGLE_GROUP)<ITooglePayload>();

export const setFeaturesByAxesData = createAction(SET_FEATURES_BY_AXES_DATA)<AxesFeatures[]>();

export const updateBlank = createAction(UPDATE_BLANK)<Blank>();

export const toggleBlank = createAction(TOGGLE_BLANK)<boolean>();

export const resetFeaturesByAxes = createAction(RESET_FEATURES_BY_AXES)();

export const loadFeatureParameter = createAction(LOAD_FEATURE_PARAMETER)();

export const setFeatureParameters = createAction(SET_FEATURE_PARAMETERS)<any>();
