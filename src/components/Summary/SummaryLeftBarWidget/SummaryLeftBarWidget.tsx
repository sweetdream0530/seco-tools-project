import React from "react";
import { useSelector } from "react-redux";
import styles from "./SummaryLeftBarWidget.scss";

import FeaturesViewerWidget from "~/components/PlanOperation/FeaturesViewerWidget/FeaturesViewerWidget";
import { getFeaturesByAxes } from "~/store/model/selectors";
import { selectIsLoading } from "~/store/data/selectors";

interface SummaryLeftBarWidgetProps {
    viewer: any; // Replace with a more specific type if possible
}

const SummaryLeftBarWidget: React.FC<SummaryLeftBarWidgetProps> = ({
    viewer,
}) => {
    const featuresByAxes = useSelector(getFeaturesByAxes);
    const loading = useSelector(selectIsLoading);

    return (
        <div className="h-full flex flex-col items-center">
            <div className={styles.axisSelect}>
                <div className="text-left">
                    {!loading &&
                        featuresByAxes &&
                        featuresByAxes.length > 0 && (
                        <>
                            <div className="pl-6 pr-4 mt-3 mb-3 cursor-pointer flex justify-between">
                                    Operation list
                            </div>
                            <FeaturesViewerWidget viewer={viewer} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryLeftBarWidget;
