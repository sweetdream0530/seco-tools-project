import { Button, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import * as React from "react";
import SettingsIcon from "@mui/icons-material/Settings";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import styles from "./SettingsWidget.scss";
import { splitCamelCase } from "~/utils/utils";
import { connectToState } from "./SettingsWidget.connect";
import { SettingsWidgetBaseProps } from "./SettingsWidget.types";

const portalVersion = process.env.REACT_APP_VERSION ?? "Not defined";

function SettingsWidgetBase(props: SettingsWidgetBaseProps) {
    const {
        settings,
        versions
    } = props;

    const [open, setOpen] = React.useState(false);
    const [localSettings, setLocalSettings] = React.useState({ ...settings });

    React.useEffect(() => {
        if (settings !== localSettings) {
            setLocalSettings(settings);
        }
    }, [open]);

    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        props.setSettings(localSettings);
        setOpen(false);
    };

    const switchSettingsByKey = (key: string, checked: boolean) => {
        setLocalSettings({
            ...localSettings,
            [key]: checked
        });
    };

    const apiVersion = (versions && "api" in versions) ? versions["api"] : "";
    const recognizerVersion = (versions && "recognizer" in versions) ? versions["recognizer"] : "";
    return (
        <>
            <Grid onClick={handleOpen} className={styles.SettingsButton}><SettingsIcon /></Grid>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Settings
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <FormGroup>
                        {Object.entries(localSettings).map((entry, idx) => (
                            <FormControlLabel
                                key={idx}
                                control={
                                    <Checkbox
                                        onChange={(event) => { switchSettingsByKey(entry[0], event.target.checked); }}
                                        checked={entry[1]}
                                    />}
                                label={splitCamelCase(entry[0])}
                            />
                        ))}
                    </FormGroup>
                    <Grid className={styles.versionsContainer}>
                        <Grid>Portal version: {portalVersion}</Grid>
                        <Grid>API version: {apiVersion}</Grid>
                        <Grid>Feature Recognize version: {recognizerVersion}</Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default connectToState(SettingsWidgetBase);