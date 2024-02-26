import { AxesFeatures, IFeatureProps, IMaterialPayload } from "~/store/model/types";

export interface ToolRecommendationRightBarWidgetProps {
    closeNotification: (id: string) => void;

    selectedFeature: IFeatureProps;
    material: IMaterialPayload;
    featuresByAxes: AxesFeatures[]
}