import { all, call, put, select, takeLatest } from "redux-saga/effects";
import axios, { CancelTokenSource } from "axios";
import {
    disableRecognizeButton,
    enableRecognizeButton,
    loading,
    loadingDone,
    setApiVersion,
    setSettingsFromServer,
} from "../data/actions";
import {
    SET_MODEL,
    RECOGNIZE_FEATURES,
    LOAD_FEATURES,
    RECOGNIZE_FEATURES_CANCEL,
    LOAD_FEATURE_PARAMETER,
} from "./consts";
import {
    previewLoadingDone,
    toolsLoading,
    toolsLoadingDone,
    setCancelTokenSource,
    resetCancelTokenSource,
} from "./actions";
import { SagaAction } from "../common/types";
import {
    AxesFeatures,
    IModelPayload,
    IModelRecognizePayload,
    IFeatureItem,
    IFeatureGroup,
    IFeatureProps,
} from "./types";
import { getConnectionId, getSettings } from "../data/selectors";
import {
    getFeaturesByAxes,
    getSelectedMaterial,
    getCancelTokenSource,
} from "./selectors";
import { errorify } from "../../utils/utils";
import { showNotification } from "../../utils/events";
import { LOAD_API_VERSION, LOAD_DEFAULT_SETTINGS } from "../data/consts";
import { previewModel, recognizeFeatures } from "./data";
import { getRecomendedTools, getFeatureParameter } from "../tools/data";
import { getAPIVersion, getDefaultSettings } from "../data/data";

function* onSetModel({ payload }: SagaAction<IModelPayload>) {
    if (!payload || !payload.model) {
        return;
    }

    yield put(loading());
    try {
        getConnectionId;
        const connectionId: string = yield select(getConnectionId);
        const response: string = yield call(previewModel, {
            ...payload,
            connectionId,
        });

        yield put(
            previewLoadingDone({
                model: response,
                modelName: payload.modelName,
                originModel: payload.model,
            })
        );
    } catch (error) {
        showNotification({
            id: Date.now().toString(),
            message: errorify(error),
            type: "error",
        });
    }
    yield put(loadingDone());
}

function* onRecognizeFeaturesCancel() {
    const cancelTokenSource: CancelTokenSource = yield select(
        getCancelTokenSource
    );

    if (cancelTokenSource) {
        cancelTokenSource.cancel("Canceled by user");
        yield put(resetCancelTokenSource());
    }
    yield put(loadingDone());
}

function* onRecognizeFeatures({ payload }: SagaAction<IModelPayload>) {
    getConnectionId;
    const connectionId: string = yield select(getConnectionId);
    const settings: { [key: string]: boolean } = yield select(getSettings);
    const cancelTokenSource = axios.CancelToken.source();
    yield put(loading());
    yield put(setCancelTokenSource(cancelTokenSource));
    if (!payload.model || !connectionId) {
        return;
    }

    try {
        yield put(disableRecognizeButton());
        yield call(recognizeFeatures, {
            model: payload.model,
            modelName: payload.modelName,
            connectionId,
            selectedAxes: payload.selectedAxes,
            blank: payload.blank,
            settings,
            cancelTokenSource,
        } as IModelRecognizePayload);
    } catch (error) {
        showNotification({
            id: Date.now().toString(),
            message: errorify(error),
            type: "error",
        });
    } finally {
        yield put(enableRecognizeButton());
        yield put(resetCancelTokenSource());
        yield put(loadingDone());
    }
}

function* onLoadFeatures() {
    const features: AxesFeatures[] = yield select(getFeaturesByAxes);
    const material: string = yield select(getSelectedMaterial);

    yield put(loading());
    yield put(toolsLoading());
    try {
        const response: string = yield call(getRecomendedTools, {
            features,
            material,
        });
        yield put(toolsLoadingDone(response));
        yield put(loadingDone());
    } catch (error) {
        showNotification({
            id: Date.now().toString(),
            message: errorify(error),
            type: "error",
        });
    }
}

function* onLoadFeatureParameter() {
    const features: AxesFeatures[] = yield select(getFeaturesByAxes);
    const material: string = yield select(getSelectedMaterial);

    console.log(features);

    yield put(loading());
    try {
        yield call(getFeatureParameter, {
            features,
            material,
        });
        yield put(loadingDone());
    } catch (error) {
        showNotification({
            id: Date.now().toString(),
            message: errorify(error),
            type: "error",
        });
    }
}

function* onLoadDefaultSettings() {
    const response: string = yield call(getDefaultSettings());

    yield put(setSettingsFromServer(response as any));
}

function* onLoadApiVersion() {
    const responseVer: string = yield call(getAPIVersion());

    yield put(setApiVersion(responseVer));
}

export default function* rootSaga() {
    yield all([
        takeLatest(SET_MODEL, onSetModel),
        takeLatest(RECOGNIZE_FEATURES, onRecognizeFeatures),
        takeLatest(RECOGNIZE_FEATURES_CANCEL, onRecognizeFeaturesCancel),
        takeLatest(LOAD_FEATURES, onLoadFeatures),
        takeLatest(LOAD_FEATURE_PARAMETER, onLoadFeatureParameter),
        takeLatest(LOAD_DEFAULT_SETTINGS, onLoadDefaultSettings),
        takeLatest(LOAD_API_VERSION, onLoadApiVersion),
    ]);
}
