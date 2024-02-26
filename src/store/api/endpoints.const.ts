export const API_HOSTNAME = process.env.WEB_API_URL!;
export const API_WSB = process.env.WSB_API_URL!;
export const API_AZURE_API = process.env.API_AZURE_API!;
export const API_AZURE_BLOB = process.env.API_AZURE_BLOB!;

export const ToolRecommendationServiceUrl = () => `${API_WSB}/ToolRecommendationService`;

// Authorization endpoints
export const AuthUrl = () => `${API_HOSTNAME}/Auth/Authenticate`;
export const GetUserUrl = () => `${API_HOSTNAME}/Auth/GetUser`;

// SignalR

export const SignalRHost = () => `${API_HOSTNAME}/modelHub`;

// Model endpoints
export const GetModelPreviewUrl = () => `${API_HOSTNAME}/Model/RecognizePreview`;
export const GetModelRecognitionUrl = () => `${API_HOSTNAME}/Model/Recognize`;

// Service endpoints
export const GetDefaultSettingsUrl = () => `${API_HOSTNAME}/Settings/GetDefaultSettings`;
export const GetApiVersionUrl = () => `${API_HOSTNAME}/Settings/GetApiVersion`;
export const FeedbackUrl = () => `${API_HOSTNAME}/Feedback`;

// External API endpoints

export const GetToolRecommendationsUrl = () => `${API_WSB}/ToolRecommendationService/0000/tool-recommendations`;
export const GetFeatureParameterUrl = (featureName: string) => `${API_WSB}/ToolRecommendationService/0000/feature/${featureName}`;
export const GetCuttingDataUrl = () => `${API_WSB}/CutDataService/0000/cutting-data`;

// Proxy API endpoints

export const GetToolImageUrl = (partNumber: string) => `${API_HOSTNAME}/Proxy/ToolImage/${partNumber}`;
export const GetCutDataImageUrl = (url: string) =>  `${API_HOSTNAME}/Proxy/CutDataImage/${url?.replace(/^.*\/\/[^/]+/, "")}`;

// UI links 

export const GetToolInCatalogUrl = (designation: string) => `https://www.secotools.com/article/84584?q=${designation}`;
export const GetToolArticleUrl = (itemNumber: string) => `https://www.secotools.com/article/p_${itemNumber}`;