import { INotification } from "../common/types";
import { IFeature } from "../model/types";

export interface ISettings {
  [key: string]: boolean;
}

export interface IVersions {
  [key: string]: string;
}

export interface IDataState {
  notifications: {[key: string]: INotification};
  loading: boolean;
  connectionId?: string;
  materialListEnabled: boolean;
  suggestionModalEnabled: boolean
  selectedFeature: IFeature | undefined;
  configurationWidgetEnabled: boolean;
  settings: ISettings;
  versions: IVersions;
  recognizeButtonDisabled: boolean;
  pageNumber: number;
  toolImageSourceUrl: any;
  cutDataInfo: any[];
}

export interface InputValuesType {
  name: string;
  value: string;
}

export interface CutDataServicePayload {
  products: string[];
  cuttingMethod: string;
  name: string;
  material: any;
  inputValues: InputValuesType[];
}

export interface FeedbackPayload {
  email: string;
  title: string;
  material: string;
  axes: string;
  actualResult: string;
  expectedResult: string;
  files: { file: File; name: string; }[];
}