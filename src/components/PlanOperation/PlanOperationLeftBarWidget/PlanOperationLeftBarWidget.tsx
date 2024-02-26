import React, { useRef } from "react";
import { setSelectedAxes } from "~/store/model/actions";
import { store } from "~/store";
import { Collapse, Divider } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import MuiToggleButton from "@mui/material/ToggleButton";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import Close from "@mui/icons-material/Close";
import styles from "./PlanOperationLeftBarWidget.scss";

import { styled } from "@mui/material/styles";
import FeatureRecognizeWidget from "~/components/PlanOperation/FeatureRecognizeWidget/FeatureRecognizeWidget";
import FeaturesViewerWidget from "~/components/PlanOperation/FeaturesViewerWidget/FeaturesViewerWidget";
import { getFeaturesByAxes, getSelectAxes } from "~/store/model/selectors";
import { selectIsLoading } from "~/store/data/selectors";

const ToggleButton = styled(MuiToggleButton)({
    textTransform: "none",
    fontSize: "16px",
    height: "44px",
    borderColor: "#CCC",
    color: "#333",
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "#006CEA",
        backgroundColor: "#F1F7FD",
        borderColor: "#99C4F7",
    },
});

interface ExpandType {
    [key: string]: boolean;
}

interface AxisTextType {
    [key: string]: string;
}

interface SelectedAxesType {
    [key: string]: number[];
}

const ItemType = "AXIS_ITEM";

const AxisText: AxisTextType = {
    x: "Front",
    "-x": "Back",
    y: "Left",
    "-y": "Right",
    z: "Top",
    "-z": "Bottom",
};

type AxisValue = number[];
type AxisEntry = [string, AxisValue];

interface DraggableAxisProps {
    axisKey: string;
    axisValue: AxisValue;
    index: number;
    moveAxis: (fromIndex: number, toIndex: number) => void;
    deleteObject: (axisKey: string) => void;
}

const DraggableAxis: React.FC<DraggableAxisProps> = ({
    axisKey,
    index,
    moveAxis,
    deleteObject,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [{ isDragging }, drag] = useDrag({
        type: ItemType,
        item: { index, axisKey },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;

    const [, drop] = useDrop({
        accept: ItemType,
        hover: (draggedItem: { index: number; axisKey: string }, monitor) => {
            if (!ref.current) {
                return;
            }
            const dragIndex = draggedItem.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) {
                return;
            }
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

            const clientOffset = monitor.getClientOffset();
            const hoverClientY =
                (clientOffset as any).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            moveAxis(dragIndex, hoverIndex);

            draggedItem.index = hoverIndex;
        },
    });

    drag(drop(ref));
    return (
        <div
            ref={ref}
            className="grid items-center grid-cols-[1fr_4fr] mt-2"
            style={{ opacity }}
        >
            <div className={styles.indexStyle}>{`Set up ${index + 1}`}</div>
            <div className="ml-6 rounded-sm text-base border-[#99C4F7] border-2 border-solid bg-[#F1F7FD] relative flex justify-center">
                <div className="text-center">
                    {axisKey.toUpperCase()}
                    <div className="text-[14px]">{AxisText[axisKey]}</div>
                </div>
                <div
                    className="absolute top-2 right-2 text-[#006CEA]"
                    onClick={() => deleteObject(axisKey)}
                >
                    <Close />
                </div>
            </div>
        </div>
    );
};

interface PlanOperationLeftBarWidgetProps {
    viewer: any; // Replace with a more specific type if possible
}

const PlanOperationLeftBarWidget: React.FC<PlanOperationLeftBarWidgetProps> = ({
    viewer,
}) => {
    const featuresByAxes = useSelector(getFeaturesByAxes);
    const loading = useSelector(selectIsLoading);

    const [expanded, setExpanded] = React.useState({
        scan_sequence: false,
        operation_list: false,
    } as ExpandType);

    const selectedAxesData = useSelector(getSelectAxes);

    const containsArray = (data: number[][], subArray: number[]): boolean => {
        return data.some(
            (item) =>
                item.length === subArray.length &&
                item.every((value, index) => value === subArray[index])
        );
    };

    const convertData = (data: Array<Array<number>> | []): SelectedAxesType => {
        const result: SelectedAxesType = {};
        if (data.length === 0) return result;

        if (containsArray(data, [1, 0, 0])) result.x = [1, 0, 0];
        if (containsArray(data, [0, 1, 0])) result.y = [0, 1, 0];
        if (containsArray(data, [0, 0, 1])) result.z = [0, 0, 1];
        if (containsArray(data, [-1, 0, 0])) result["-x"] = [-1, 0, 0];
        if (containsArray(data, [0, -1, 0])) result["-y"] = [0, -1, 0];
        if (containsArray(data, [0, 0, -1])) result["-z"] = [0, 0, -1];

        return result;
    };

    const [selectedAxes, setAxis] = React.useState(
        convertData(selectedAxesData)
    );

    const axisToggle = (key: string, axis: number[]): void => {
        let axes;
        if (key in selectedAxes) {
            const { ...rest } = selectedAxes;
            delete rest[key];
            axes = rest;
            setAxis(rest);
        } else {
            axes = { ...selectedAxes, [key]: axis };
            setAxis(axes);
        }
        store.dispatch(setSelectedAxes(Object.values(axes)));
    };

    const handleExpandClick = (axis: string): void => {
        const prop1 = { ...expanded, [axis]: !expanded[axis] };
        setExpanded(prop1);
    };

    const axesArray: AxisEntry[] = Object.entries(selectedAxes);

    const moveAxis = (fromIndex: number, toIndex: number): void => {
        const updatedAxesArray = [...axesArray];
        const [movedAxis] = updatedAxesArray.splice(fromIndex, 1);
        updatedAxesArray.splice(toIndex, 0, movedAxis);

        const newAxes: Record<string, AxisValue> =
            Object.fromEntries(updatedAxesArray);
        setAxis(newAxes);
        store.dispatch(setSelectedAxes(Object.values(newAxes)));
    };

    const deleteAxis = (apiKey: string): void => {
        let axes;
        if (apiKey in selectedAxes) {
            const { ...rest } = selectedAxes;
            delete rest[apiKey];
            axes = rest;
            setAxis(rest);
            store.dispatch(setSelectedAxes(Object.values(axes)));
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className={styles.axisSelect}>
                <div className="text-left">
                    <div>
                        <div
                            className={styles.titleSection}
                            onClick={() => handleExpandClick("scan_sequence")}
                        >
                            Define Scan sequence of axises
                            <div className="text-[#006CEA]">
                                {expanded.scan_sequence ? <Remove /> : <Add />}
                            </div>
                        </div>

                        <Collapse
                            in={expanded.scan_sequence}
                            timeout="auto"
                            unmountOnExit
                        >
                            <div className={styles.axisSection}>
                                <div className="grid grid-cols-3 text-sm">
                                    <ToggleButton
                                        value={"x"}
                                        selected={"x" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("x", [1, 0, 0])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>X</div>
                                            <div className="text-xs">Front</div>
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        value={"y"}
                                        selected={"y" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("y", [0, 1, 0])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>Y</div>
                                            <div className="text-xs">Left</div>
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        value={"z"}
                                        selected={"z" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("z", [0, 0, 1])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>Z</div>
                                            <div className="text-xs">
                                                Bottom
                                            </div>
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        value={"-x"}
                                        selected={"-x" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("-x", [-1, 0, 0])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>-X</div>
                                            <div className="text-xs">Back</div>
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        value={"-y"}
                                        selected={"-y" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("-y", [0, -1, 0])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>-Y</div>
                                            <div className="text-xs">Right</div>
                                        </div>
                                    </ToggleButton>
                                    <ToggleButton
                                        value={"-z"}
                                        selected={"-z" in selectedAxes}
                                        onClick={() =>
                                            axisToggle("-z", [0, 0, -1])
                                        }
                                    >
                                        <div className="text-center">
                                            <div>-Z</div>
                                            <div className="text-xs">
                                                Bottom
                                            </div>
                                        </div>
                                    </ToggleButton>
                                </div>
                                <div className="mt-4">
                                    <Button
                                        variant="outlined"
                                        className="w-full"
                                        style={{
                                            fontSize: "16px",
                                            textTransform: "none",
                                        }}
                                    >
                                        Create a customize axis from model
                                    </Button>
                                </div>
                            </div>
                            <div className={styles.axisList}>
                                <div className={styles.headerText}>
                                    Drag and place to rearrange the sequence
                                </div>
                                <div className="flex flex-col">
                                    {axesArray.map(
                                        ([axisKey, axisValue], index) => (
                                            <DraggableAxis
                                                key={axisKey}
                                                axisKey={axisKey}
                                                axisValue={axisValue}
                                                index={index}
                                                moveAxis={moveAxis}
                                                deleteObject={deleteAxis}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </Collapse>
                    </div>
                    <Divider style={{ borderColor: "#99C4F7" }} />
                    {featuresByAxes &&
                        featuresByAxes.length > 0 && (
                        <>
                            <div
                                className={styles.titleSection}
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
                                <div className={styles.operationHeaderText}>
                                        Drag and place to rearrange the sequence
                                </div>
                                <FeaturesViewerWidget viewer={viewer} />
                            </Collapse>
                        </>
                    )}
                </div>
            </div>
            <FeatureRecognizeWidget />
        </div>
    );
};

export default PlanOperationLeftBarWidget;
