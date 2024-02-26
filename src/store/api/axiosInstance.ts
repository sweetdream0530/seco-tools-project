import axios from "axios";
import { API_AZURE_API, API_HOSTNAME, AuthUrl, ToolRecommendationServiceUrl } from "./endpoints.const";
import { showErrorNotification } from "~/utils/events";
import ErrorMessages from "~/utils/ErrorMessages";

const _axiosInstance = axios.create();

_axiosInstance.interceptors.request.use((config) => {
    if (config.url?.includes(API_HOSTNAME)) {
        config.headers["Authorization"] =  localStorage.getItem("apiKey") ?? "";
        config.headers["Access-Control-Allow-Origin"] = "*";
        config.headers["Access-Control-Allow-Methods"] = "DELETE, POST, GET, OPTIONS";
        config.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With";
    }
    else if (config.url?.includes(API_AZURE_API)) {
        config.headers["Access-Control-Allow-Origin"] = "*";
    }
    else if (config.url?.includes(ToolRecommendationServiceUrl())) {
        config.headers["SecoTools-Feature-Version"] = "PreMachiningTest";
    }
    return config;
});

_axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error?.response?.status === 401 && error.request.responseURL !== AuthUrl()) {
        localStorage.removeItem("apiKey");
        showErrorNotification(ErrorMessages.tokenExpired);
        location.href = "/";
    }
    return error;
});

export const axiosInstance = _axiosInstance;

export const generateInternalApiHeaders = () => {
    return {
        headers: {"Authorization": localStorage.getItem("apiKey") ?? "" }
    };
};