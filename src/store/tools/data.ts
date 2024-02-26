import _, { isArray } from "lodash";
import { showErrorNotification } from "../../utils/events";
import { errorify } from "../../utils/utils";
import { AxesFeatures, IFeatureGroup, IFeatureProps } from "../model/types";
import { CutDataServicePayload } from "../data/types";
import {
    axiosInstance,
    generateInternalApiHeaders,
} from "../api/axiosInstance";
import {
    GetCutDataImageUrl,
    GetCuttingDataUrl,
    GetToolImageUrl,
    GetToolRecommendationsUrl,
    GetFeatureParameterUrl,
} from "../api/endpoints.const";

const getRecomendedToolsPayload = ({
    name,
    calibrationType,
    calibrationValue,
}: any) => {
    return {
        featureRecommendationsRequests: [] as any,
        materials: [
            {
                id: name,
                calibration: calibrationType
                    ? {
                        type: calibrationType,
                        value: String(calibrationValue),
                    }
                    : {},
            },
        ],
    };
};

const getFeatureParameterPayload = ({
    name,
    calibrationType,
    calibrationValue,
}: any) => {
    return {
        inputValues: [] as any,
        materials: [
            {
                id: name,
                calibration: calibrationType
                    ? {
                        type: calibrationType,
                        value: String(calibrationValue),
                    }
                    : {},
            },
        ],
    };
};

const getFeatureRequestPayload = ({ name, featureParameters }: any) => {
    return {
        featureVolume: "1",
        FeatureIdentifier: name,
        toolRecommendationRequest: {
            inputValues: featureParameters?.map(({ name, value }: any) => ({
                name,
                value:
                    (value as any) === "Not Implemented" ? "1" : String(value),
            })),
        },
    };
};

const getFeatureParameterRequestPayload = ({ featureParameters }: any) => {
    return featureParameters?.map(({ name, value }: any) => ({
        name,
        value: (value as any) === "Not Implemented" ? "1" : String(value),
    }));
};

/***************************************
 * This is a method that performs request to the API to retrieve recommended tool list
 */
export const getRecomendedTools = async (params: any): Promise<any | null> => {
    const { features, material } = params;
    (global as any).toolList = {};
    try {
        const data = getRecomendedToolsPayload(material);
        const featuresHashRelations = [] as any[];
        features.forEach((axis: AxesFeatures) => {
            axis?.features?.forEach((rootObj: any) => {
                if (!rootObj) {
                    return;
                }

                if ("propsHash" in rootObj) {
                    (rootObj as IFeatureGroup).features.forEach(
                        (subFeature, idx) => {
                            if (idx === 0) {
                                const hashes = (
                                    rootObj as IFeatureGroup
                                ).features.map(
                                    (subGroupFeature) =>
                                        subGroupFeature.feature.hash
                                );
                                featuresHashRelations.push(hashes);

                                const featureRequest = getFeatureRequestPayload(
                                    subFeature.feature
                                );
                                data.featureRecommendationsRequests.push(
                                    featureRequest
                                );
                            }
                        }
                    );
                } else {
                    const feature = rootObj.feature as IFeatureProps;
                    const featureRequest = getFeatureRequestPayload(feature);

                    featuresHashRelations.push(feature.hash);
                    data.featureRecommendationsRequests.push(featureRequest);
                }
            });
        });

        const response = await axiosInstance.post(
            GetToolRecommendationsUrl(),
            data
        );

        if (response.status !== 200) {
            throw new Error(errorify(response.data));
        }
        (global as any).toolList =
            response?.data?.featureRecommendations?.reduce(
                (acc: any, item: any, idx: number) => {
                    const featureHash = featuresHashRelations[idx];
                    if (isArray(featureHash)) {
                        featureHash.forEach((oneHash) => {
                            acc[oneHash] = item;
                        });
                    } else {
                        acc[featureHash] = item;
                    }
                    acc[featureHash] = item;
                    return acc;
                },
                {} as any
            ) ?? {};

        return response.data;
    } catch (error) {
        showErrorNotification(errorify(error));
    }

    return null;
};

export const getFeatureParameter = async (params: any): Promise<any | null> => {
    const { features, material } = params;
    const data = getFeatureParameterPayload(material);
    (global as any).featureParameters = {};
    for (const axis of features) {
        for (const rootObj of axis?.features || []) {
            if (!rootObj) {
                continue;
            }

            if ("propsHash" in rootObj) {
                for (const subFeature of (rootObj as IFeatureGroup).features) {
                    const hash = subFeature.feature.hash;
                    if ((global as any).featureParameters[hash]) continue;
                    const featureParameterRequest =
                        getFeatureParameterRequestPayload(subFeature);
                    data.inputValues = featureParameterRequest;
                    const response = await axiosInstance.post(
                        GetFeatureParameterUrl(subFeature.feature.name),
                        data
                    );
                    console.log(response);
                    if (response.status !== 200) {
                        continue;
                    }
                    (global as any).featureParameters = {
                        ...(global as any).featureParameters,
                        [hash]: response.data.feature,
                    };
                }
            } else {
                const feature = rootObj.feature as IFeatureProps;
                console.log("abcde" + feature);
                const hash = feature.hash;
                if ((global as any).featureParameters[hash]) continue;
                const featureParameterRequest =
                    getFeatureParameterRequestPayload(feature);
                data.inputValues = featureParameterRequest;
                const response = await axiosInstance.post(
                    GetFeatureParameterUrl(feature.name),
                    data
                );
                console.log(response);
                if (response.status !== 200) {
                    continue;
                }
                (global as any).featureParameters = {
                    ...(global as any).featureParameters,
                    [hash]: response.data.feature,
                };
            }
        }
    }

    return "ok";
};
const getCalcDataParams = () => {
    return {
        calculationPackages: ["CutData", "Process"],
        name: "",
        products: [],
        cuttingMethod: "1.1.1.1",
        material: {},
        selectorValues: [],
        inputValues: [],
        calculateInputRanges: false,
    };
};

/***************************************
 * This is a method that performs request to the calc data service to retrieve calc data
 */
export const calculateCutData = async (params: CutDataServicePayload) => {
    try {
        const payload = _.assign({}, getCalcDataParams(), params);
        const response = await axiosInstance.post(GetCuttingDataUrl(), payload);

        if (response.status !== 200) {
            showErrorNotification(errorify(response.data));
            return { results: [] };
        }
        return response.data;
    } catch (error) {
        showErrorNotification(errorify(error));
    }
};

/***************************************
 * This is a method that retrieve tool image image via proxy
 */
export async function fetchToolImage(partNumber: string) {
    const response = await fetch(
        GetToolImageUrl(partNumber),
        generateInternalApiHeaders()
    );

    if (response.ok) return response.blob();

    return null;
}

/***************************************
 * This is a method that retrieve cut data image via proxy
 */
export async function fetchBlob(url: string) {
    const response = await fetch(
        GetCutDataImageUrl(url),
        generateInternalApiHeaders()
    );

    if (response.ok) return response.blob();

    return null;
}
