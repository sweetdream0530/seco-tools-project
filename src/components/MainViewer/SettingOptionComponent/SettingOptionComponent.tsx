import React from "react";
import { useSelector } from "react-redux";
import { isBlankEnabled } from "~/store/model/selectors";
import { toggleBlank } from "~/store/model/actions";
import { store } from "~/store";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import styles from "./SettingOptionComponent.scss";

interface SettingOptionComponentProps {
    viewer: any; // Replace with a more specific type if possible
}

const SettingOptionComponent: React.FC<SettingOptionComponentProps> = ({
    viewer,
}) => {
    const blankEnabled = useSelector(isBlankEnabled);

    const toggleBlankEv = (
        changeEvent: React.ChangeEvent,
        checked: boolean
    ): void => {
        viewer?.toggleObject("Blank", checked);
        store.dispatch(toggleBlank(checked));
    };

    const togglePart = (
        changeEvent: React.ChangeEvent,
        checked: boolean
    ): void => {
        viewer?.toggleObject("Gltf", checked);
    };

    return (
        <div className="absolute top-12 left-12">
            <FormGroup>
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ color: "#006CEA" }}
                            defaultChecked
                            onChange={togglePart}
                            size="small"
                        />
                    }
                    label={<div className={styles.textStyle}>Show model</div>}
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            sx={{ color: "#006CEA" }}
                            onChange={toggleBlankEv}
                            color="primary"
                            checked={blankEnabled}
                            size="small"
                        />
                    }
                    label={<div className={styles.textStyle}>Show blank</div>}
                />
                <FormControlLabel
                    control={
                        <Checkbox sx={{ color: "#006CEA" }} size="small" />
                    }
                    sx={{ fontSize: "14px" }}
                    label={
                        <div className={styles.textStyle}>Show custom axis</div>
                    }
                />
            </FormGroup>
        </div>
    );
};

export default SettingOptionComponent;
