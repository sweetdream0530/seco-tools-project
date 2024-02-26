import _ from 'lodash';
import { showNotification } from '../../utils/events';
import { errorify } from '../../utils/utils';
import { IFeatureProps, IModelPayload, IModelRecognizePayload } from '../model/types';
import { axiosInstance } from './axiosInstance';
import { API_HOSTNAME, API_WSB } from './endpoints.const';
import { CutDataServicePayload, FeedbackPayload } from '../data/types';
import axios, { CancelTokenSource } from 'axios';

export const getDefaultSettings = () => {
  var call: CancelTokenSource;
  return async () : Promise<any | null>  => {
    if (call) {
        call.cancel();
    }
    call = axios.CancelToken.source();
    try {
      const response = await axiosInstance.get(`${API_HOSTNAME}/Settings/GetDefaultSettings`);
      if (response.status !== 200) {
        throw new Error(errorify(response.data));
      }
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return {};
      }
      showNotification({
        id: Date.now().toString(),
        message: errorify(error),
        type: 'error',
      });
      return {};
    }
  }
}

export const getAPIVersion = () => {
  var call: CancelTokenSource;
  return async () : Promise<any | null>  => {
    if (call) {
        call.cancel();
    }
    call = axios.CancelToken.source();
    try {
      const response = await axiosInstance.get(`${API_HOSTNAME}/Settings/GetApiVersion`);
      if (response.status !== 200) {
        throw new Error(errorify(response.data));
      }
      return response.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        return {};
      }
      showNotification({
        id: Date.now().toString(),
        message: errorify(error),
        type: 'error',
      });
      return {};
    }
  }
}

export const previewModel = async (
  payload: IModelPayload,
): Promise<any | null> => {
  try {
    const data = new FormData();
    data.append('ClientId', payload.connectionId!);
    data.append(
      'File',
      // eslint-disable-next-line no-undef
      new Blob([payload.model as ArrayBuffer]),
      payload.modelName,
    );

    const response = await axiosInstance.post(
      `${API_HOSTNAME}/Model/RecognizePreview`, 
      data, 
      { responseType: 'arraybuffer' }
    );
    if (response.status !== 200) {
      throw new Error(errorify(response.data));
    }
    return response.data;
  } catch (error) {

    const errorMessage = new TextDecoder().decode((error as any)?.response?.data);
    showNotification({
      id: Date.now().toString(),
      message: errorMessage ?? errorify(error),
      type: 'error',
    });
  }

  return null;
};

export const recognizeFeatures = async (
  payload: IModelRecognizePayload,
): Promise<any | null> => {
  try {
    const data = new FormData();

    data.append('ClientId', payload.connectionId);
    data.append(
      'File',
      // eslint-disable-next-line no-undef
      new Blob([payload.model as ArrayBuffer]),
      payload.modelName,
    );
    data.append('Axes', JSON.stringify(payload.selectedAxes));
    data.append('Blank', JSON.stringify(payload.blank));
    data.append('Settings', JSON.stringify(payload.settings ?? {}));

    const response = await axiosInstance.post(
      `${API_HOSTNAME}/Model/Recognize`,
      data,
      {
        responseType: 'arraybuffer',
      },
    );

    if (response.status !== 200) {
      throw new Error(errorify(response.data));
    }

    return response.data;
  } catch (error) {
    showNotification({
      id: Date.now().toString(),
      message: errorify(error),
      type: 'error',
    });
  }

  return null;
};


export const getRecomendedTools = async (
  params: any
): Promise<any | null> => {
  const {payload, material} = params;
  (global as any).toolList = [];
  try {
    const featuresPayload = JSON.parse(payload);
    const data = {
      featureRecommendationsRequests: [],
      materials: [
        {
            "id": material.name,
            "calibration": material.calibrationType ? {
                "type": material.calibrationType,
                "value": String(material.calibrationValue)
            } : {}
        }
      ]
    } as any;

    featuresPayload.forEach((axis: any) => {
      axis.features.forEach((rootObj: any) => {
        if (!rootObj || !rootObj.feature) {
          return;
        }

        const feature = rootObj.feature as IFeatureProps;
        const featureRequest = {
          featureVolume: '1',
          FeatureIdentifier: feature.name,
          toolRecommendationRequest: {
            inputValues: feature?.featureParameters?.map(({name, value}) => ({name, value: (value as any) === 'Not Implemented' ? '1' : String(value)}))
          }
        };
        data.featureRecommendationsRequests.push(featureRequest);
      });
    });

    const response = await axiosInstance.post(
      `${API_WSB}/ToolRecommendationService/0000/tool-recommendations`,
      data
    );

    if (response.status !== 200) {
      throw new Error(errorify(response.data));
    }
    console.log('get tools', response.data);
    (global as any).toolList = response.data;
    return response.data;
  } catch (error) {
    showNotification({
      id: Date.now().toString(),
      message: errorify(error),
      type: 'error',
    });
  }

  return null;
};

export const calculateCutData = async (params: CutDataServicePayload) => {
  try {
  const payload = _.assign({}, calcDataParams, params);
  const response = await axiosInstance.post(
    `${API_WSB}/CutDataService/0000/cutting-data`,
    payload
  );

  if (response.status !== 200) {
    showNotification({
      id: Date.now().toString(),
      message: errorify(response.data),
      type: 'error',
    });
    return {results: []};
  }
  return response.data;
 } catch (error) {
    showNotification({
      id: Date.now().toString(),
      message: errorify(error),
      type: 'error',
    });
  }
}

const calcDataParams = {
  "calculationPackages": [
    "CutData",
    "Process"
  ],
  "products": [],
  "cuttingMethod": "1.1.1.1",
  "material": {},
  "selectorValues": [],
  "inputValues": [],
  "calculateInputRanges": false
};

export const sendFeedback = async (
  payload: FeedbackPayload,
): Promise<any | null> => {
  try {
    const data = new FormData();

    data.append('email', payload.email);
    data.append('title', payload.title);
    data.append('material', payload.material);
    data.append('axes', payload.axes);
    data.append('actualResult', payload.actualResult);
    data.append('expectedResult', payload.expectedResult);
    console.log('files', payload.files);
    payload.files.forEach(({ file, name }: any) => {
      data.append('File', file);
      data.append('FileName', name);
    })

    const response = await axiosInstance.post(
      `${API_HOSTNAME}/Feedback`,
      data,
    );

    if (response.status !== 200) {
      throw new Error(errorify(response.data));
    }

    return response.data;
  } catch (error) {
    showNotification({
      id: Date.now().toString(),
      message: errorify(error),
      type: 'error',
    });
  }

  return null;
};

export async function fetchToolImage(partNumber: string) {
  
  const response = await fetch(
    `${API_HOSTNAME}/Proxy/ToolImage/${partNumber}`,
    {
      headers: {'Authorization': localStorage.getItem("apiKey") ?? '' }
    }
  );

  if (response.ok)
    return response.blob();

  return null;
}

export async function fetchBlob(url: string) {
  
  const response = await fetch(
    `${API_HOSTNAME}/Proxy/CutDataImage/${url?.replace(/^.*\/\/[^\/]+/, '')}`,
    {
      headers: {'Authorization': localStorage.getItem("apiKey") ?? '' }
    }
  );

  if (response.ok)
    return response.blob();

  return null;
}