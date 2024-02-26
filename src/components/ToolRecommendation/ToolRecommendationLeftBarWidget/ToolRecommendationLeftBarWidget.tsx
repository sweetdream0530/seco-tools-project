import React from "react";
import { Collapse, Button, Dialog } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSelector } from "react-redux";
import styles from "./ToolRecommendationLeftBarWidget.scss";

import FeaturesViewerWidget from "~/components/PlanOperation/FeaturesViewerWidget/FeaturesViewerWidget";
import { getFeaturesByAxes } from "~/store/model/selectors";
import { selectIsLoading } from "~/store/data/selectors";
import { setPageNumber } from "~/store/data/actions";
import { store } from "~/store";

interface ExpandType {
    [key: string]: boolean;
}

interface ToolRecommendationLeftBarWidgetProps {
    viewer: any; // Replace with a more specific type if possible
}

const ToolRecommendationLeftBarWidget: React.FC<
    ToolRecommendationLeftBarWidgetProps
> = ({ viewer }) => {
    const featuresByAxes = useSelector(getFeaturesByAxes);
    const loading = useSelector(selectIsLoading);
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [expanded, setExpanded] = React.useState({
        operation_list: true,
    } as ExpandType);

    const handleExpandClick = (axis: string): void => {
        const prop1 = { ...expanded, [axis]: !expanded[axis] };
        setExpanded(prop1);
    };

    const nextScreen = () => {
        store.dispatch(setPageNumber(4));
    };

    return (
        <div className="h-full flex flex-col items-center">
            <div className={styles.axisSelect}>
                <div className="text-left">
                    {!loading &&
                        featuresByAxes &&
                        featuresByAxes.length > 0 && (
                        <>
                            <div
                                className="pl-6 pr-4 mt-3 mb-3 cursor-pointer flex justify-between"
                                onClick={() =>
                                    handleExpandClick("operation_list")
                                }
                            >
                                    Operation list
                                <div className="text-[#006CEA]">
                                    {expanded.operation_list ? (
                                        <Remove />
                                    ) : (
                                        <Add />
                                    )}
                                </div>
                            </div>
                            <Collapse
                                in={expanded.operation_list}
                                timeout="auto"
                                unmountOnExit
                            >
                                <FeaturesViewerWidget viewer={viewer} />
                            </Collapse>
                        </>
                    )}
                </div>
            </div>
            <Button
                variant="contained"
                component="label"
                onClick={handleClickOpen}
                style={{
                    backgroundColor: "#333",
                    color: "white",
                    width: "260px",
                    marginBottom: "48px",
                    textTransform: "none",
                }}
            >
                Apply and to next step
                <ArrowForwardIcon />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <Button
                    onClick={handleClose}
                    autoFocus
                    style={{
                        position: "absolute",
                        right: "24px",
                        top: "24px",
                        width: "24px",
                        height: "24px",
                        minWidth: "0px",
                    }}
                >
                    X
                </Button>
                <div className="flex flex-col gap-16 items-center mx-16 mt-20 mb-12">
                    <div>
                        By proceeding to summary page, you will not be able to
                        go back and change tool selections.
                    </div>
                    <div className="flex justify-center gap-6">
                        <Button
                            onClick={nextScreen}
                            variant="outlined"
                            style={{ textTransform: "none", width: "108px" }}
                        >
                            Confirm
                        </Button>
                        <Button
                            onClick={handleClose}
                            variant="outlined"
                            autoFocus
                            style={{ textTransform: "none", width: "108px" }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default ToolRecommendationLeftBarWidget;
