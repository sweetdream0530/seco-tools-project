import { AxesFeatures, IFeatureProps, IMaterialPayload } from "~/store/model/types";

export interface ToolsSuggestionWidgetBaseProps {
    closeNotification: (id: string) => void;

    selectedFeature: IFeatureProps;
    material: IMaterialPayload;
    featuresByAxes: AxesFeatures[]
}