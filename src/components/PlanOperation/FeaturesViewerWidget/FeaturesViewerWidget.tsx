import { Button, Grid } from "@mui/material";
import * as React from "react";
import { round } from "lodash";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import styles from "./FeaturesViewerWidget.scss";
import {
    Direction,
    IFeature,
    IFeatureGroup,
    ITooglePayload,
} from "~/store/model/types";
import {
    FEATURE_GEOM_INPUT_MAP,
    NonManufacturableFeature,
    UnknwnFeature,
} from "./FeaturesViewerWidget.const";
import { connectToState } from "./FeaturesViewerWidget.connect";
import { FeaturesViewerWidgetBaseProps } from "./FeaturesViewerWidget.types";
import { getDirectionLabel } from "./FeaturesViewerWidget.utils";
import { getPageNumber } from "~/store/data/selectors";
import { useSelector } from "react-redux";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

import update from "immutability-helper";
import FeatureItem from "../FeaturesViewerWidget/FeatureItem";

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        border: "1px solid #F66",
        borderRadius: 4,
        color: "black",
        boxShadow: theme.shadows[1],
        fontSize: 14,
        maxWidth: 240,
        padding: "16px 24px 16px 24px",
    },
}));

function FeaturesViewerWidgetBase(props: FeaturesViewerWidgetBaseProps) {
    const { loading, featuresByAxes, selectedFeatureHash, selectedFeature } =
        props;

    const pageNumber = useSelector(getPageNumber);
    const tools = (global as any).toolList ?? {};

    React.useEffect(() => {
        setTimeout(() => {
            //highlight all features
            featuresByAxes.forEach((axis) => {
                axis?.features?.forEach((item) => {
                    if ("propsHash" in item) {
                        props.viewer.highlightFeatures(item.faceIds);
                        return;
                    }
                    if (!item?.feature?.featureFaceIds) {
                        return;
                    }
                    // props.viewer.highlightFeatures(item.feature.featureFaceIds);
                });
            });
            props.viewer.simulateCanvasClick();
        }, 1000);
    }, []);

    const showSuggestionTools = (selectedFeature: any) => {
        props.showSuggestionModal({
            ...selectedFeature,
            systemId: selectedFeatureHash,
        });
    };

    const toolsExist = (featureHash: string): boolean => {
        const featureToolset =
            featureHash in tools ? tools[featureHash] : undefined;
        console.log(featureHash, tools);
        if (!featureToolset || !featureToolset.toolRecommendations) {
            return false;
        }
        return featureToolset?.toolRecommendations?.length !== 0;
    };

    React.useEffect(() => {
        console.log("tools exist changed");
    }, [loading]);
    const toolsExists = toolsExist(selectedFeatureHash);

    const getSelectedFeatureParams = () => {
        const getUnit = (units: any, name: string) => {
            if (!name) {
                return "";
            }
            return `${units[name]}: `;
        };

        if (!selectedFeature) {
            return null;
        }

        if (selectedFeature.name === UnknwnFeature) {
            return (
                <Grid className={styles.propertiesContainer} container>
                    <Grid className={styles.propsWrapper} container>
                        <Grid item xs={12}>
                            Reason: This geometry is currently not supported.
                        </Grid>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid className={styles.propertiesContainer} container>
                <div className={styles.btnWrapper}>
                    {selectedFeature.name !== NonManufacturableFeature ? (
                        <Button
                            disabled={!toolsExists}
                            className={
                                toolsExists
                                    ? styles.suggestionBtn
                                    : styles.suggestionBtnDisabled
                            }
                            onClick={() => {
                                showSuggestionTools(selectedFeature);
                            }}
                            variant="contained"
                            component="label"
                        >
                            {toolsExists
                                ? "View recommended tools"
                                : "No Suggestion Found"}
                        </Button>
                    ) : null}
                </div>
                <Grid className={styles.propsWrapper} container>
                    {selectedFeature?.featureParameters?.map(
                        ({ name, value }, idx) => (
                            <Grid key={idx} item xs={12}>
                                {getUnit(units, name)}
                                {Number.isFinite(value)
                                    ? round(value, 3).toFixed(3)
                                    : value}
                            </Grid>
                        )
                    )}
                    <Grid key="facesCount" item xs={12}>
                        Faces count: {selectedFeature.featureFaceIds.length}
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const units = selectedFeature?.featureParameters
        ? FEATURE_GEOM_INPUT_MAP[selectedFeature.name].units
        : {};

    const onFeatureClick = (feature: any, hash: string) => {
        props.viewer.highlightFeatures([]);
        if (selectedFeatureHash === hash) {
            props.selectFeature(undefined);
        } else {
            props.selectFeature(hash);
            props.viewer.highlightFeatures(feature.featureFaceIds);
        }
        props.viewer.simulateCanvasClick();
    };

    const toggleByAxis = (direction: Direction | string) => {
        props.toggleFeaturesByAxis(direction);
    };

    const toogleAndHightlightGroup = (group: IFeatureGroup) => {
        const { propsHash, faceIds } = group;

        props.viewer.highlightFeatures([]);
        if (selectedFeatureHash === propsHash) {
            props.selectFeature(undefined);
            props.toggleGroup({
                groupHash: propsHash,
                visible: false,
            } as ITooglePayload);
        } else {
            props.toggleGroup({
                groupHash: propsHash,
                visible: true,
            } as ITooglePayload);
            props.selectFeature(propsHash);
            props.viewer.highlightFeatures(faceIds);
        }
        props.viewer.simulateCanvasClick();
    };

    const renderFeature = (item: IFeature, id: number, idx: number) => {
        const feature = item.feature;
        if (!item?.feature?.featureFaceIds) {
            return;
        }

        const activeStyle = feature.selected
            ? { border: "1px solid #006CEA", color: "#006CEA" }
            : {};
        return (
            <Grid
                key={item.feature.hash}
                className={styles.listItem}
                style={activeStyle}
                item
                onClick={() => {
                    onFeatureClick(feature, feature.hash);
                }}
                xs={12}
            >
                {pageNumber === 2 ? (
                    <FeatureItem
                        columnIndex={id}
                        index={idx}
                        moveCard={moveCard}
                    >
                        {FEATURE_GEOM_INPUT_MAP[feature.name]?.name ??
                            feature.name}{" "}
                        <div className="rounded-lg bg-[#F1F7FD] px-1 ml-4">
                            {`${feature.featureFaceIds.length} ${
                                feature.featureFaceIds.length > 1
                                    ? "faces"
                                    : "face"
                            }`}
                        </div>
                    </FeatureItem>
                ) : (
                    <div className="flex">
                        {FEATURE_GEOM_INPUT_MAP[feature.name]?.name ??
                            feature.name}{" "}
                        <div className="rounded-lg bg-[#F1F7FD] px-1 ml-4">
                            {`${feature.featureFaceIds.length} ${
                                feature.featureFaceIds.length > 1
                                    ? "faces"
                                    : "face"
                            }`}
                        </div>
                        {!toolsExist(item.feature.hash) && (
                            <LightTooltip
                                placement="right"
                                title="No tool found for this feature"
                            >
                                <div className="rounded-lg bg-[#FCC] px-1 ml-4">
                                    NT
                                </div>
                            </LightTooltip>
                        )}
                    </div>
                )}
            </Grid>
        );
    };

    const renderGroup = (group: IFeatureGroup, idx: number) => {
        if (!group?.faceIds) {
            return;
        }

        const activeStyle = group.selected
            ? { border: "1px solid #006CEA", color: "#006CEA" }
            : {};
        return (
            <Grid key={group.propsHash}>
                <Grid
                    className={styles.listItem}
                    style={activeStyle}
                    item
                    onClick={() => {
                        toogleAndHightlightGroup(group);
                    }}
                    xs={12}
                >
                    {group?.features.length > 0 ? (
                        !group.toggled ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowUpIcon />
                        )
                    ) : null}
                    {idx + 1} -{" "}
                    {FEATURE_GEOM_INPUT_MAP[group.name]?.name ?? group.name} (
                    {group.features.length})
                </Grid>
                <Grid
                    className={styles.subItems}
                    style={!group.toggled ? { display: "none" } : {}}
                >
                    {group?.features?.map((item, subIdx) => {
                        return renderFeature(item, idx, subIdx);
                    })}
                </Grid>
            </Grid>
        );
    };
    const moveCard = React.useCallback(
        (
            dragColumnIndex: number,
            dragIndex: number,
            hoverColumnIndex: number,
            hoverIndex: number
        ) => {
            const dragCard =
                featuresByAxes[dragColumnIndex]?.features[dragIndex];

            if (dragColumnIndex === hoverColumnIndex) {
                props.setFeaturesByAxesData(
                    update(featuresByAxes, {
                        [dragColumnIndex]: {
                            features: {
                                $splice: [
                                    [dragIndex, 1],
                                    [hoverIndex, 0, dragCard],
                                ],
                            },
                        },
                    })
                );
            } else {
                props.setFeaturesByAxesData(
                    update(featuresByAxes, {
                        [dragColumnIndex]: {
                            features: {
                                $splice: [[dragIndex, 1]],
                            },
                        },
                        [hoverColumnIndex]: {
                            features: {
                                $splice: [[hoverIndex, 0, dragCard]],
                            },
                        },
                    })
                );
            }
        },
        [featuresByAxes]
    );

    const featureParams = getSelectedFeatureParams();
    return (
        <Grid className={styles.featureWidgetWrapper}>
            <Grid className={styles.featureList} container>
                <Grid
                    className={
                        featureParams
                            ? styles.featureItemsWithParams
                            : styles.featureItems
                    }
                >
                    {featuresByAxes?.map((axis, id) => {
                        return (
                            <Grid key={id}>
                                <Grid
                                    className={
                                        axis?.features.length > 0
                                            ? styles.axisLabel
                                            : styles.axisLabelDisabled
                                    }
                                    onClick={() =>
                                        toggleByAxis(
                                            axis.direction ?? "unrecognized"
                                        )
                                    }
                                >
                                    {axis.direction &&
                                    !axis.unrecognizedFeatures
                                        ? `Setup ${id + 1}: ${getDirectionLabel(
                                            axis.direction
                                        )}`
                                        : "Unknown features "}
                                    {axis?.features.length > 0 ? (
                                        axis.toggled ? (
                                            <KeyboardArrowDownIcon />
                                        ) : (
                                            <KeyboardArrowUpIcon />
                                        )
                                    ) : null}
                                </Grid>
                                <Grid
                                    style={
                                        axis.toggled ? { display: "none" } : {}
                                    }
                                >
                                    {axis?.features?.map((item, idx) => {
                                        if ("propsHash" in item) {
                                            return renderGroup(item, idx);
                                        }
                                        return renderFeature(item, id, idx);
                                    })}
                                </Grid>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}

export default connectToState(FeaturesViewerWidgetBase);
