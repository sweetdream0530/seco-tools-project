import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import { Checkbox } from "@mui/material";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";

import ToggleButton from "../ToggleButtonWidget";
import styles from "./DataInputWidget.scss";
import {
    getModelSize,
    getSelectedMaterial,
    isBlankEnabled,
    selectFeatureRecognizeData,
} from "~/store/model/selectors";
import { store } from "~/store";
import { toggleConfigurationWidget } from "~/store/data/actions";
import {
    setSelectedAxes,
    toggleBlank,
    updateBlank,
} from "~/store/model/actions";
import FeatureRecognizeWidget from "../PlanOperation/FeatureRecognizeWidget/FeatureRecognizeWidget";
import { isconfigurationWidgetEnabled } from "~/store/data/selectors";
import { useEffect, useRef } from "react";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface ExpandType {
    [key: string]: boolean;
}

interface SelectedAxesType {
    [key: string]: number[];
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function ModelUploadWidget(props: any) {
    const modelSize = useSelector(getModelSize)?.toArray() ?? [0, 0, 0];
    const material = useSelector(getSelectedMaterial);
    const blankEnabled = useSelector(isBlankEnabled);
    const configurationWidgetEnabled = useSelector(
        isconfigurationWidgetEnabled
    );
    const { modelName }: any = useSelector(selectFeatureRecognizeData);

    const [sizeAddition, setSizeAddition] = React.useState({
        beforeX: 0,
        afterX: 0,
        beforeY: 0,
        afterY: 0,
        beforeZ: 0,
        afterZ: 0,
    });

    const resetBlank = (): void => {
        const sizeAdditionProps = {
            beforeX: 0,
            afterX: 0,
            beforeY: 0,
            afterY: 0,
            beforeZ: 0,
            afterZ: 0,
        };

        setSizeAddition(sizeAdditionProps);
        props.viewer.resizeBlank(sizeAdditionProps);
        store.dispatch(
            updateBlank({ ...sizeAdditionProps, enabled: blankEnabled })
        );
        document
            .querySelectorAll("#DataInputWidget input:not([disabled])")
            .forEach((input: any) => (input.value = 0));
    };

    const modelRef = useRef(modelName);
    useEffect(() => {
        if (modelName !== modelRef.current) {
            resetBlank();
        }
        modelRef.current = modelName;
    }, [modelName]);

    const setPanelToggle = (isToggled: boolean) => {
        store.dispatch(toggleConfigurationWidget(isToggled));
    };

    const [expanded, setExpanded] = React.useState({
        x: false,
        y: false,
        z: false,
    } as ExpandType);
    const [selectedAxes, setAxis] = React.useState({
        x: [1, 0, 0],
    } as SelectedAxesType);

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
        props.viewer.resizeBlank(sizeAdditionProps);
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

    const handleExpandClick = (axis: string): void => {
        const prop1 = { ...expanded, [axis]: !expanded[axis] };
        setExpanded(prop1);
    };

    const axisToggle = (key: string, axis: number[]): void => {
        let axes;
        if (key in selectedAxes) {
            axes = { ...selectedAxes };
            delete axes[key];
            setAxis(axes);
        }
        else {
            axes = { ...selectedAxes, [key]: axis };
            setAxis(axes);
        }
        store.dispatch(setSelectedAxes(Object.values(axes)));
    };

    const togglePart = (
        changeEvent: React.ChangeEvent,
        checked: boolean
    ): void => {
        props.viewer?.toggleObject("Gltf", checked);
    };

    const toggleBlankEv = (
        changeEvent: React.ChangeEvent,
        checked: boolean
    ): void => {
        props.viewer?.toggleObject("Blank", checked);
        store.dispatch(toggleBlank(checked));
    };

    return (
        <div className={styles.container}>
            <div
                className={styles.dataInputTitle}
                onClick={() => {
                    setPanelToggle(!configurationWidgetEnabled);
                }}
            >
                Model Configuration
            </div>
            {configurationWidgetEnabled && (
                <Stack
                    id="DataInputWidget"
                    className={
                        configurationWidgetEnabled
                            ? styles.componentStack
                            : styles.componentStackHidden
                    }
                    direction="column"
                    alignItems="center"
                    spacing={0.5}
                >
                    <div
                        className={
                            props.isDisabled || !material
                                ? styles.dataInputDisabled
                                : styles.dataInputEnabled
                        }
                    ></div>
                    <p>
                        Current Axis:
                        {Object.keys(selectedAxes).join(", ").toUpperCase()}
                    </p>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <ToggleButton
                            selected={"x" in selectedAxes}
                            callback={() => axisToggle("x", [1, 0, 0])}
                        >
                            X
                        </ToggleButton>
                        <ToggleButton
                            selected={"y" in selectedAxes}
                            callback={() => axisToggle("y", [0, 1, 0])}
                        >
                            Y
                        </ToggleButton>
                        <ToggleButton
                            selected={"z" in selectedAxes}
                            callback={() => axisToggle("z", [0, 0, 1])}
                        >
                            Z
                        </ToggleButton>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        style={{ flex: 1 }}
                    >
                        <ToggleButton
                            selected={"-x" in selectedAxes}
                            callback={() => axisToggle("-x", [-1, 0, 0])}
                        >
                            -X
                        </ToggleButton>
                        <ToggleButton
                            selected={"-y" in selectedAxes}
                            callback={() => axisToggle("-y", [0, -1, 0])}
                        >
                            -Y
                        </ToggleButton>
                        <ToggleButton
                            selected={"-z" in selectedAxes}
                            callback={() => axisToggle("-z", [0, 0, -1])}
                        >
                            -Z
                        </ToggleButton>
                    </Stack>
                    <p>Blank Dimensions</p>
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        style={{ flex: 1 }}
                    >
                        <Button
                            variant="contained"
                            component="label"
                            onClick={resetBlank}
                        >
                            Fill From Part
                        </Button>

                        <Stack direction="column" alignItems="left" spacing={0}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <Checkbox
                                    defaultChecked
                                    onChange={togglePart}
                                    color="primary"
                                />
                                Show Part
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <Checkbox
                                    onChange={toggleBlankEv}
                                    color="primary"
                                    checked={blankEnabled}
                                />
                                Show Blank
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack
                        direction="row"
                        alignItems="center"
                        className={styles.listHeader}
                    >
                        <p>Axis X</p>

                        <ExpandMore
                            expand={expanded.x}
                            onClick={() => handleExpandClick("x")}
                            aria-expanded={expanded.x}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Stack>

                    <Collapse
                        in={expanded.x}
                        timeout="auto"
                        className={styles.blankPaddings}
                        unmountOnExit
                    >
                        <Stack direction="column" alignItems="left" spacing={0}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Part:
                                <Input
                                    disabled
                                    style={{ flex: 1 }}
                                    value={modelSize[0]}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add before:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "beforeX")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add after:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "afterX")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Total:
                                <Input
                                    readOnly
                                    style={{ flex: 1 }}
                                    value={
                                        modelSize[0] +
                                        Math.abs(sizeAddition.afterX) +
                                        Math.abs(sizeAddition.beforeX)
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Collapse>

                    <Stack
                        direction="row"
                        alignItems="center"
                        className={styles.listHeader}
                    >
                        <p>Axis Y</p>

                        <ExpandMore
                            expand={expanded.y}
                            onClick={() => handleExpandClick("y")}
                            aria-expanded={expanded.y}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Stack>

                    <Collapse
                        in={expanded.y}
                        timeout="auto"
                        className={styles.blankPaddings}
                        unmountOnExit
                    >
                        <Stack direction="column" alignItems="left" spacing={0}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Part:
                                <Input
                                    disabled
                                    style={{ flex: 1 }}
                                    value={modelSize[1]}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add before:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "beforeY")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add after:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "afterY")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Total:
                                <Input
                                    readOnly
                                    style={{ flex: 1 }}
                                    value={
                                        modelSize[1] +
                                        Math.abs(sizeAddition.afterY) +
                                        Math.abs(sizeAddition.beforeY)
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Collapse>

                    <Stack
                        direction="row"
                        alignItems="center"
                        className={styles.listHeader}
                    >
                        <p>Axis Z</p>

                        <ExpandMore
                            expand={expanded.z}
                            onClick={() => handleExpandClick("z")}
                            aria-expanded={expanded.z}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </Stack>

                    <Collapse
                        in={expanded.z}
                        timeout="auto"
                        className={styles.blankPaddings}
                        unmountOnExit
                    >
                        <Stack direction="column" alignItems="left" spacing={0}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Part:
                                <Input
                                    disabled
                                    style={{ flex: 1 }}
                                    value={modelSize[2]}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add before:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "beforeZ")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Add after:
                                <Input
                                    style={{ flex: 1 }}
                                    type="number"
                                    onChange={(e) =>
                                        adjustBlankSize(e, "afterZ")
                                    }
                                    onKeyDown={inputKeyDown}
                                    inputProps={{ min: 0 }}
                                    defaultValue={0}
                                />
                            </Stack>

                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                Total:
                                <Input
                                    readOnly
                                    style={{ flex: 1 }}
                                    value={
                                        modelSize[2] +
                                        Math.abs(sizeAddition.beforeZ) +
                                        Math.abs(sizeAddition.afterZ)
                                    }
                                />
                            </Stack>
                        </Stack>
                    </Collapse>
                    <FeatureRecognizeWidget
                        disabled={Object.keys(selectedAxes).length === 0}
                    />
                </Stack>
            )}
        </div>
    );
}
