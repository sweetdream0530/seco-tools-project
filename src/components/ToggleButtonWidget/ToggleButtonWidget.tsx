import * as React from "react";
import Button from "@mui/material/Button";
import styles from "./ToggleButtonWidget.scss";
import { ToggleButtonWidgetBaseProps } from "./ToggleButtonWidget.types";

function ToggleButtonWidgetBase(props: ToggleButtonWidgetBaseProps) {
    const { children, callback, selected } = props;
    const [colour, setColour] = React.useState(true);

    const toggle = () => {
        setColour(!colour);
        callback && callback();
    };

    return (
        <Button
            className={styles.toggleButton}
            variant="outlined"
            component="label"
            onClick={() => toggle()}
            color={selected ? "secondary" : "primary"}
        >
            {children}
        </Button>
    );
}

export default ToggleButtonWidgetBase;
