import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    Stack,
    Divider,
    OutlinedInput,
    InputAdornment,
    Collapse,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiToggleButton from "@mui/material/ToggleButton";
import { Add, Remove } from "@mui/icons-material";
import ModelUploadWidget from "../ModelUploadWidget";
import { store } from "~/store";
import { updateBlank } from "~/store/model/actions";
import {
    getBlank,
    getModelSize,
    isBlankEnabled,
    selectFeatureRecognizeData,
} from "~/store/model/selectors";
import styles from "./DefineWorkPieceLeftBarWidget.scss";

const ToggleButton = styled(MuiToggleButton)({
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "#006CEA",
        backgroundColor: "#F1F7FD",
        borderColor: "#99C4F7",
    },
});

interface DefineWorkPieceLeftBarWidgetProps {
    removeObject: () => void;
    viewer: any;
}

interface ExpandType {
    [key: string]: boolean;
}

const DefineWorkPieceLeftBarWidget: React.FC<
    DefineWorkPieceLeftBarWidgetProps
> = ({ removeObject, viewer }) => {
    const modelSize = useSelector(getModelSize)?.toArray() ?? [0, 0, 0];

    const { modelName } = useSelector(selectFeatureRecognizeData);
    const blankEnabled = useSelector(isBlankEnabled);
    const [expanded, setExpanded] = React.useState({
        workpiece_dimensions: false,
        blank_dimensions: false,
    } as ExpandType);

    const blank = useSelector(getBlank);

    const [sizeAddition, setSizeAddition] = React.useState({
        beforeX: blank.beforeX,
        afterX: blank.afterX,
        beforeY: blank.beforeY,
        afterY: blank.afterY,
        beforeZ: blank.beforeZ,
        afterZ: blank.afterZ,
    });

    const [selectedAxis, setSelectedAxis] = useState("X");

    const inputKeyDown = (e: any) => {
        if (
            e.code === "Minus" ||
            (e.target.value === "0" && e.code === "Digit0")
        ) {
            e.preventDefault();
            return;
        }
    };

    const adjustBlankSize = (e: any, type: string): void => {
        let { value } = e.target;

        if (value.length === 0) {
            value = 0;
        } else if (!isNumeric(value) || value < 0 || e.code === "Minus") {
            e.preventDefault();
            return;
        }

        const sizeAdditionProps = {
            ...sizeAddition,
            [type]: parseFloat(value) ?? 0,
        };

        setSizeAddition(sizeAdditionProps);
        viewer.resizeBlank(sizeAdditionProps);
        store.dispatch(
            updateBlank({ ...sizeAdditionProps, enabled: blankEnabled })
        );
    };

    const isNumeric = (str: any): boolean => {
        if (typeof str != "string") return false; // we only process strings!
        return (
            !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str))
        ); // ...and ensure strings of whitespace fail
    };

    function getSizeAdditionValue(
        key: string,
        sizeAddition: { [key: string]: number }
    ): number {
        return sizeAddition[key] ?? 0;
    }

    const handleExpansion = (panel: string): void => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [panel]: !prevExpanded[panel],
        }));
    };

    return (
        <div className={styles.container}>
            <div className="ml-6 mr-4">
                <ModelUploadWidget removeObject={removeObject} />
            </div>
            <Divider style={{ marginTop: "33px", borderColor: "#99C4F7" }} />
            { modelName && modelName.length > 0 &&
                <>
                    <div className="ml-6 mr-4 text-left">
                        <div
                            className={styles.titleSection}
                            onClick={() =>
                                handleExpansion("workpiece_dimensions")
                            }
                        >
                            Workpiece dimensions
                            <div className="text-[#006CEA]">
                                {expanded.workpiece_dimensions ? (
                                    <Remove />
                                ) : (
                                    <Add />
                                )}
                            </div>
                        </div>

                        <Collapse
                            in={expanded.workpiece_dimensions}
                            timeout="auto"
                            unmountOnExit
                        >
                            <div className="grid grid-cols-[3fr_1fr_1fr] ml-2 mb-4 mr-10 text-base font-normal">
                                <div>Axis X (Width):</div>
                                <div>{modelSize[0]}</div>
                                <div>mm</div>
                                <div>Axis Y (Length):</div>
                                <div>{modelSize[1]}</div>
                                <div>mm</div>
                                <div>Axis Z (Height):</div>
                                <div>{modelSize[2]}</div>
                                <div>mm</div>
                            </div>
                        </Collapse>
                    </div>
                    <Divider style={{ borderColor: "#99C4F7" }} />
                    <div className="ml-6 mr-4 text-left">
                        <div
                            className={styles.titleSection}
                            onClick={() => handleExpansion("blank_dimensions")}
                        >
                            Blank dimensions
                            <div className="text-[#006CEA]">
                                {expanded.blank_dimensions ? (
                                    <Remove />
                                ) : (
                                    <Add />
                                )}
                            </div>
                        </div>
                        <Collapse
                            in={expanded.blank_dimensions}
                            timeout="auto"
                            unmountOnExit
                        >
                            <div className="mb-6 flex">
                                {["X", "Y", "Z"].map((axis, index) => (
                                    <ToggleButton
                                        key={index}
                                        value={axis}
                                        selected={axis === selectedAxis}
                                        style={{
                                            width: "100%",
                                            textTransform: "none",
                                            fontSize: "16px",
                                            height: "44px",
                                        }}
                                        onClick={() => setSelectedAxis(axis)}
                                    >
                                        <div className="text-center">
                                            <div>{axis}</div>
                                            <div className="text-xs">
                                                {axis === "X"
                                                    ? "Width"
                                                    : axis === "Y"
                                                        ? "Length"
                                                        : "Height"}
                                            </div>
                                        </div>
                                    </ToggleButton>
                                ))}
                            </div>
                            {["X", "Y", "Z"].map(
                                (axis, index) =>
                                    selectedAxis === axis && (
                                        <div
                                            key={axis}
                                            className="ml-3 mr-3 mb-6"
                                        >
                                            <Stack
                                                direction="column"
                                                alignItems="left"
                                                spacing={0}
                                            >
                                                <Stack
                                                    direction="column"
                                                    alignItems={"flex-start"}
                                                    width={"100%"}
                                                >
                                                    <div
                                                        className={
                                                            styles.titleStyle
                                                        }
                                                    >
                                                        Part
                                                    </div>
                                                    <OutlinedInput
                                                        className="w-full"
                                                        style={{border: "1px solid #006CEA"}}
                                                        disabled
                                                        size="small"
                                                        id="outlined-basic"
                                                        value={modelSize[index]}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                mm
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </Stack>

                                                <Stack
                                                    direction="column"
                                                    alignItems={"flex-start"}
                                                    className="mt-2 w-full"
                                                >
                                                    <div
                                                        className={
                                                            styles.titleStyle
                                                        }
                                                    >
                                                        {axis} (Left)
                                                    </div>
                                                    <OutlinedInput
                                                        className="w-full"
                                                        style={{border: "1px solid #006CEA"}}
                                                        onKeyDown={inputKeyDown}
                                                        type="number"
                                                        value={Math.abs(
                                                            getSizeAdditionValue(
                                                                "before" + axis,
                                                                sizeAddition
                                                            )
                                                        )}
                                                        onChange={(e) =>
                                                            adjustBlankSize(
                                                                e,
                                                                "before" + axis
                                                            )
                                                        }
                                                        size="small"
                                                        id="outlined-basic"
                                                        inputProps={{ min: 0 }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                mm
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </Stack>

                                                <Stack
                                                    direction="column"
                                                    alignItems={"flex-start"}
                                                    className="mt-2 w-full"
                                                >
                                                    <div
                                                        className={
                                                            styles.titleStyle
                                                        }
                                                    >
                                                        {axis} (Right)
                                                    </div>
                                                    <OutlinedInput
                                                        className="w-full"
                                                        style={{border: "1px solid #006CEA"}}
                                                        onKeyDown={inputKeyDown}
                                                        type="number"
                                                        onChange={(e) =>
                                                            adjustBlankSize(
                                                                e,
                                                                "after" + axis
                                                            )
                                                        }
                                                        value={Math.abs(
                                                            getSizeAdditionValue(
                                                                "after" + axis,
                                                                sizeAddition
                                                            )
                                                        )}
                                                        size="small"
                                                        id="outlined-basic"
                                                        inputProps={{ min: 0 }}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                mm
                                                            </InputAdornment>
                                                        }
                                                    />
                                                </Stack>

                                                <Stack
                                                    direction="column"
                                                    alignItems={"flex-start"}
                                                    className="mt-2 w-full"
                                                >
                                                    <div
                                                        className={
                                                            styles.titleStyle
                                                        }
                                                    >
                                                        Total:
                                                    </div>
                                                    <OutlinedInput
                                                        className="w-full"
                                                        readOnly
                                                        size="small"
                                                        style={{border: "1px solid #006CEA"}}
                                                        endAdornment={
                                                            <InputAdornment position="end">
                                                                mm
                                                            </InputAdornment>
                                                        }
                                                        value={
                                                            modelSize[index] +
                                                            Math.abs(
                                                                getSizeAdditionValue(
                                                                    "after" +
                                                                        axis,
                                                                    sizeAddition
                                                                )
                                                            ) +
                                                            Math.abs(
                                                                getSizeAdditionValue(
                                                                    "before" +
                                                                        axis,
                                                                    sizeAddition
                                                                )
                                                            )
                                                        }
                                                    />
                                                </Stack>
                                            </Stack>
                                        </div>
                                    )
                            )}
                        </Collapse>
                    </div>
                    <Divider style={{ borderColor: "#99C4F7" }} />
                </>
            }
        </div>
    );
};

export default DefineWorkPieceLeftBarWidget;
