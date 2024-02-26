import { Vector3 } from "three";
import { ISOMaterial } from "~/components/DefineWorkPiece/MaterialSelectionWidget/types";
import { CancelTokenSource } from "axios";

export interface IFeatureParameter {
  name: string;
  unit: string;
  value: number;
}

export interface IFeature {
  selected: boolean;
  feature: IFeatureProps;
}

export interface IFeatureProps {
  featureFaceIds: string[];
  featureParameters: IFeatureParameter[];
  name: string;
  selected?: boolean;
  hash: string;
}

export interface Direction {
  x: number;
  y: number;
  z: number;
}

export interface IFeatureGroup {
  name: string;
  propsHash: string;
  faceIds: string[];
  selected?: boolean;
  toggled?: boolean;
  features: IFeature[];
}

export type IFeatureItem = IFeature | IFeatureGroup;

export interface AxesFeatures {
  originalFeatures: IFeatureItem[];
  features: IFeatureItem[];
  direction?: Direction;
  toggled?: boolean;
  unrecognizedFeatures?: boolean;
}

export interface IModelState {
  modelName?: string;
  model: string | ArrayBuffer | null;
  modelSize?: Vector3;
  originModel: string | ArrayBuffer | null;
  recognitionAvailable: boolean;
  featuresByAxes: AxesFeatures[];
  selectedAxes: Array<Array<number>> | [];
  material?: IMaterialPayload;
  toolsCount: number;
  blank: Blank;
  selectedFeatureHash?: string;
  selectedFeature?: IFeatureProps;
  cancelTokenSource?: CancelTokenSource;
  featureParameters?: any;
}

export interface Blank {
  beforeX: number;
  beforeY: number;
  beforeZ: number;

  afterX: number;
  afterY: number;
  afterZ: number;
  enabled: boolean;
}

export interface IModelPayload {
  connectionId?: string;
  modelName?: string;
  originModel?: string | ArrayBuffer | null;
  model: string | ArrayBuffer | null;
  selectedAxes?: Array<Array<number>>;
  blank?: Blank;
  settings?: {[key: string]: boolean};
}

export interface IModelRecognizePayload extends IModelPayload {
  connectionId: string;
  cancelTokenSource: CancelTokenSource;
}

export interface IMaterialPayload {
  name: string;
  calibrationType: string;
  calibrationValue: number;
  isoMaterial: ISOMaterial;
}

export interface ITooglePayload {
  groupHash: string;
  visible: boolean;
}