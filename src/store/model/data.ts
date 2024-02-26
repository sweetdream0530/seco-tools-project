import { showErrorNotification } from "../../utils/events";
import { errorify } from "../../utils/utils";
import { IModelPayload, IModelRecognizePayload } from "../model/types";
import { axiosInstance } from "../api/axiosInstance";
import { GetModelPreviewUrl, GetModelRecognitionUrl } from "../api/endpoints.const";

/***************************************
* This is a method that send step model to API to prepare it for recognition and returns glb model
*/
export const previewModel = async (
    { connectionId, model, modelName}: IModelPayload,
): Promise<any | null> => {
    try {
        const data = new FormData();
        data.append("ClientId", connectionId!);
        data.append(
            "File",
            new Blob([model as ArrayBuffer]),
            modelName,
        );

        const response = await axiosInstance.post(
            GetModelPreviewUrl(), 
            data, 
            { responseType: "arraybuffer" }
        );
        if (response.status !== 200) {
            throw new Error(errorify(response.data));
        }
        return response.data;
    } catch (error) {
        const errorMessage = new TextDecoder().decode((error as any)?.response?.data);
        showErrorNotification(errorMessage ?? errorify(error));
    }

    return null;
};

/***************************************
* This is a method that perform feature recognition at server side, returns glb model.
* Feature list will be returned by socket connection in async mode.
*/
export const recognizeFeatures = async (
    payload: IModelRecognizePayload,
): Promise<any | null> => {
    try {
        const { connectionId, model, modelName, selectedAxes, blank, settings } = payload;
        const data = new FormData();

        data.append("ClientId", connectionId);
        data.append(
            "File",
            // eslint-disable-next-line no-undef
            new Blob([model as ArrayBuffer]),
            modelName,
        );
        data.append("Axes", JSON.stringify(selectedAxes));
        data.append("Blank", JSON.stringify(blank));
        data.append("Settings", JSON.stringify(settings ?? {}));

        const response = await axiosInstance.post(
            GetModelRecognitionUrl(),
            data,
            { responseType: "arraybuffer" ,
                cancelToken: payload.cancelTokenSource.token,},
        );

        if (response.status !== 200) {
            throw new Error(errorify(response.data));
        }

        return response.data;
    } catch (error) {
        showErrorNotification(errorify(error));
    }

    return null;
};
