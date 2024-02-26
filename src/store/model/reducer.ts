import produce from "immer";

import { ActionType, Reducer, getType } from "typesafe-actions";

import * as actionCreators from "./actions";
import {
    AxesFeatures,
    IFeature,
    IFeatureGroup,
    IModelState,
    ITooglePayload,
} from "./types";
import { base64ToArrayBuffer } from "../../utils/utils";
import _, { round } from "lodash";
import hash from "object-hash";
import { ISettings } from "../data/types";

type DataAction = ActionType<typeof actionCreators>;

const initialState: IModelState = {
    cancelTokenSource: undefined,
    model: null,
    originModel: null,
    recognitionAvailable: true,
    featuresByAxes: [],
    featureParameters: {},
    selectedAxes: [[1, 0, 0]],
    toolsCount: 0,
    selectedFeatureHash: undefined,
    blank: {
        beforeX: 0,
        beforeY: 0,
        beforeZ: 0,
        afterX: 0,
        afterY: 0,
        afterZ: 0,
        enabled: false,
    },
};

const serializeFeatures = (
    featuresByAxes: AxesFeatures[],
    settings: ISettings
) => {
    const groupSimilarFeatures =
        "groupSimilarFeatures" in settings
            ? settings["groupSimilarFeatures"]
            : false;
    return featuresByAxes.map((axes) => {
        const direction = axes.direction as any;
        if (
            !parseInt(direction?.x) &&
            !parseInt(direction?.y) &&
            !parseInt(direction?.z)
        ) {
            axes.unrecognizedFeatures = true;
        }
        axes.originalFeatures = axes.features;

        if (!groupSimilarFeatures) {
            axes.features.map((feature) => {
                const rootFeature = feature as IFeature;
                rootFeature.feature.hash = hash(feature);
            });
            return axes;
        }

        const similarFeatures = axes.features.reduce(
            (featureList, feature, idx) => {
                const rootFeature = feature as IFeature;
                rootFeature.feature?.featureParameters?.forEach((param) => {
                    if (Number.isFinite(param.value)) {
                        param.value = round(param.value, 3);
                    }
                });
                const objHash = hash(rootFeature.feature.featureParameters);
                const suffix = axes.unrecognizedFeatures ? idx : "";
                featureList[objHash + suffix] =
                    objHash in featureList ? featureList[objHash] + 1 : 1;
                return featureList;
            },
            {} as any
        );

        const groppedFeatures = axes.features.reduce(
            (featureList, feature, idx) => {
                const rootFeature = feature as IFeature;
                rootFeature.feature.hash = hash(feature);
                const objHash = hash(rootFeature.feature.featureParameters);
                if (similarFeatures[objHash] > 1) {
                    if (objHash in featureList) {
                        (featureList[objHash] as IFeatureGroup).features.push(
                            rootFeature
                        );
                        (featureList[objHash] as IFeatureGroup).faceIds.push(
                            ...rootFeature.feature.featureFaceIds
                        );
                    } else {
                        const subFeature = rootFeature.feature;

                        featureList[objHash] = {
                            name: subFeature.name,
                            propsHash: objHash,
                            faceIds: [...subFeature.featureFaceIds],
                            features: [feature],
                        } as IFeatureGroup;
                    }
                } else {
                    const suffix = axes.unrecognizedFeatures ? idx : "";
                    featureList[objHash + suffix] = feature;
                }

                return featureList;
            },
            {} as any
        );
        axes.features = Object.values(groppedFeatures);
        return axes;
    });
};

// eslint-disable-next-line default-param-last
const reducer: Reducer<IModelState, DataAction> = (
    state = initialState,
    action
) =>
    produce(state, (draft: IModelState) => {
        switch (action.type) {
        case getType(actionCreators.setCancelTokenSource): {
            return {
                ...state,
                cancelTokenSource: action.payload,
            };
        }
        case getType(actionCreators.resetCancelTokenSource): {
            return { ...state, cancelTokenSource: undefined };
        }
        case getType(actionCreators.previewLoadingDone): {
            const { model, originModel, modelName } = action.payload ?? {};
            return {
                ...initialState,
                model,
                modelName,
                originModel: originModel!,
                recognitionAvailable: true,
                material: draft.material,
                selectedAxes: draft.selectedAxes,
            };
        }

        case getType(actionCreators.updateModel): {
            const model = action.payload;
            draft.model = base64ToArrayBuffer(model as string);
            return;
        }

        case getType(actionCreators.loadFeatures): {
            const { features, settings } = action.payload;
            const featuresByAxes = JSON.parse(features);
            draft.featuresByAxes = featuresByAxes
                ? serializeFeatures(featuresByAxes, settings)
                : [];
            return;
        }
        case getType(actionCreators.setFeaturesByAxesData): {
            const data = action.payload;
            draft.featuresByAxes = data;
            return;
        }
        case getType(actionCreators.toggleFeaturesByAxis): {
            const direction = action.payload;
            draft.featuresByAxes = draft.featuresByAxes.map((axis) => {
                if (_.isEqual(axis.direction, direction)) {
                    axis.toggled = !axis.toggled;
                }
                return axis;
            });
            return;
        }
        case getType(actionCreators.toggleGroup): {
            const { groupHash, visible } = action.payload as ITooglePayload;
            draft.featuresByAxes = draft.featuresByAxes.map((axis) => {
                axis.features = axis.features.map((feature) => {
                    if (
                        "propsHash" in feature &&
                            feature["propsHash"] === groupHash
                    ) {
                        feature.toggled = visible;
                    }
                    return feature;
                });
                return axis;
            });
            return;
            return;
        }

        case getType(actionCreators.setModelSize): {
            draft.modelSize = action.payload;
            return;
        }
        case getType(actionCreators.setSelectedAxes): {
            draft.selectedAxes = action.payload;
            return;
        }
        case getType(actionCreators.setMaterial): {
            draft.material = action.payload ?? undefined;
            return;
        }
        case getType(actionCreators.updateBlank): {
            draft.blank = action.payload;
            return;
        }
        case getType(actionCreators.toggleBlank): {
            draft.blank.enabled = action.payload;
            return;
        }
        case getType(actionCreators.resetFeaturesByAxes): {
            draft.featuresByAxes = draft.featuresByAxes.map(
                (featureAxis) => {
                    return {
                        ...featureAxis,
                        features: featureAxis.originalFeatures,
                    };
                }
            );
            return;
        }
        case getType(actionCreators.selectFeature): {
            if (!action.payload || action.payload === undefined) {
                draft.selectedFeature = undefined;
            }
            draft.featuresByAxes.forEach((featureAxis) => {
                featureAxis?.features?.forEach((rootObj) => {
                    if ("propsHash" in rootObj) {
                        const featureGroup = rootObj as IFeatureGroup;
                        featureGroup.selected = false;
                        if (action.payload === featureGroup.propsHash) {
                            featureGroup.selected = true;
                        }

                        featureGroup.features.forEach((subFeature) => {
                            subFeature.feature.selected = false;
                            if (
                                action.payload === subFeature.feature.hash
                            ) {
                                subFeature.feature.selected = true;
                                rootObj.toggled = true;
                                draft.selectedFeature = subFeature.feature;
                            }
                        });
                    }
                    const rootFeature = rootObj as IFeature;
                    if (!rootFeature?.feature) {
                        return;
                    }
                    if (action.payload === rootFeature.feature.hash) {
                        rootFeature.feature.selected = true;
                        draft.selectedFeature = rootFeature.feature;
                    } else {
                        rootFeature.feature.selected = false;
                    }
                });
            });
            draft.selectedFeatureHash = action.payload;
            return;
        }
        case getType(actionCreators.toolsLoading): {
            draft.toolsCount = 0;
            draft.blank.enabled = false;
            return;
        }
        case getType(actionCreators.toolsLoadingDone): {
            const { featureRecommendations } =
                    (action.payload as any) ?? {};
            draft.toolsCount = featureRecommendations?.length ?? 0;
            return;
        }

        case getType(actionCreators.resetModelState): {
            const u = draft.selectedAxes;

            draft = { ...initialState, selectedAxes: u };
            return;
        }

        case getType(actionCreators.setFeatureParameters): {
            draft.featureParameters = action.payload;
            return;
        }

        default:
            // eslint-disable-next-line no-useless-return
            return;
        }
    });

export default reducer;
