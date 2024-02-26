import { AxesFeatures, Direction, IFeature, IFeatureProps, ITooglePayload } from "~/store/model/types";

export interface FeaturesViewerWidgetBaseProps {
    viewer: any;

    showSuggestionModal: (feature: IFeature) => void;
    selectFeature: (featureHash: string | undefined) => void;
    setFeaturesByAxesData: (featuresByAxes: AxesFeatures[]) => void;
    toggleFeaturesByAxis: (direction: Direction | string) => void;
    toggleGroup: (props: ITooglePayload) => void;

    loading: boolean;
    featuresByAxes: AxesFeatures[];
    selectedFeatureHash: string;
    selectedFeature: IFeatureProps;
}