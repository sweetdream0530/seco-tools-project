import { axiosInstance } from "../api/axiosInstance";
import axios, { AxiosError, CancelTokenSource } from "axios";
import { AuthPayload } from "./types";
import { AuthUrl, GetUserUrl } from "../api/endpoints.const";
import { errorify } from "~/utils/utils";
import ErrorMessages from "~/utils/ErrorMessages";
import { showErrorNotification } from "~/utils/events";

/***************************************
* This is a sign in request method that perform auth on API
* @param login, user login
* @param password, user password
*/
export const signInRequest = async ({ login, password }: AuthPayload) => {
    try {
        const body = {
            login,
            password,
        } as any;

        const response = await axiosInstance.post(AuthUrl(), body);
        if (response.status === 200) {
            const { data } = response;
            return data;
        }
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError?.response?.status === 401) {
            showErrorNotification(ErrorMessages.wrongPassword);
        } else {
            showErrorNotification(ErrorMessages.serverError);
        }
    }
};

/***************************************
* This is a getUser request method allows to retrieve user data from API
*/
export const getUserRequest = () => {
    // Cancel token allows to perform one request per time
    let call: CancelTokenSource;
    return async (): Promise<any | null> => {
        if (call) {
            call.cancel();
        }
        call = axios.CancelToken.source();
        try {
            const response = await axiosInstance.post(GetUserUrl());
            if (response.status !== 200) {
                throw new Error(errorify(response.data));
            }
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                return {};
            }
            const axiosError = error as AxiosError;
            if (axiosError?.response?.status === 401) {
                console.error(ErrorMessages.tokenExpired, error);
                showErrorNotification(ErrorMessages.tokenExpired);
                return false;
            }
            showErrorNotification(ErrorMessages.serverError);
            return {};
        }
    };
};