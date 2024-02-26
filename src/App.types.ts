import { ISettings } from "./store/data/types";
import { AxesFeatures, Blank } from "./store/model/types";
import { TRANSFORM_MODE } from "./store/transformModes/consts";

export interface AppBaseProps {
    selectTool: (tool: string) => void;
    transformPanelTool: (mode: TRANSFORM_MODE) => void;
    getUser: () => void;
    loadSettings: () => void;
    loadApiVersion: () => void;


    model: string | ArrayBuffer | null;
    blank: Blank;
    featuresByAxes: AxesFeatures[];
    loading: boolean;
    toolsSuggestionEnabled: boolean;
    settings: ISettings;
    selectedTool: string;
    selectedTransformMode: string;
    isUserAuthenticated: boolean;
}