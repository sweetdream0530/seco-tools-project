import { showErrorNotification } from "../../utils/events";
import { errorify } from "../../utils/utils";
import axios, { CancelTokenSource } from "axios";
import { axiosInstance } from "../api/axiosInstance";
import { FeedbackUrl, GetApiVersionUrl, GetDefaultSettingsUrl } from "../api/endpoints.const";
import { FeedbackPayload } from "./types";

/***************************************
* This is a method that receives default settings for feature recognition library
*/
export const getDefaultSettings = () => {
    let call: CancelTokenSource;
    return async () : Promise<any | null>  => {
        if (call) {
            call.cancel();
        }
        call = axios.CancelToken.source();
        try {
            const response = await axiosInstance.get(GetDefaultSettingsUrl());
            if (response.status !== 200) {
                throw new Error(errorify(response.data));
            }
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                return {};
            }
            showErrorNotification(errorify(error));
            return {};
        }
    };
};

/***************************************
* This is a method that receives API & Feature Recognition versions
*/
export const getAPIVersion = () => {
    let call: CancelTokenSource;
    return async () : Promise<any | null>  => {
        if (call) {
            call.cancel();
        }
        call = axios.CancelToken.source();
        try {
            const response = await axiosInstance.get(GetApiVersionUrl());
            if (response.status !== 200) {
                throw new Error(errorify(response.data));
            }
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                return {};
            }
            showErrorNotification(errorify(error));
            return {};
        }
    };
};

/***************************************
* This is a method that send user feedback via API to the mail server
*/
export const sendFeedback = async (
    payload: FeedbackPayload,
): Promise<any | null> => {
    try {
        const data = new FormData();

        data.append("email", payload.email);
        data.append("title", payload.title);
        data.append("material", payload.material);
        data.append("axes", payload.axes);
        data.append("actualResult", payload.actualResult);
        data.append("expectedResult", payload.expectedResult);

        //This part allows to upload files and handles name duplicates like "name (idx+1)"
        payload.files.forEach(({ file, name }: any) => {
            data.append("File", file);
            data.append("FileName", name);
        });

        const response = await axiosInstance.post(
            FeedbackUrl(),
            data,
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