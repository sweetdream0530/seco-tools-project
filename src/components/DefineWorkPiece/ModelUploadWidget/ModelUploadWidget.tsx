import * as React from "react";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";

import styles from "./ModelUploadWidget.scss";
import { showErrorNotification } from "~/utils/events";
import { availableFormats } from "./ModelUploadWidget.consts";
import { connectToState } from "./ModelUploadWidget.connect";
import { ModelUploadWidgetBaseProps } from "./ModelUploadWidget.types";

const ModelUploadWidgetBase = (props: ModelUploadWidgetBaseProps) => {
    const { modelName = "" } = props;

    const getExtension = (filename: string) => {
        return /[.]/.exec(filename) ? /[^.]+$/.exec(filename)?.at(0) : "";
    };

    const uploadHandler = (e: any) => {
        if (!e || !e.target) {
            return;
        }
        props.resetDataState();
        props.resetModelState();

        const { files } = e.target;

        const fileReader = new FileReader();
        if (fileReader && files && files.length) {
            fileReader.readAsArrayBuffer(files[0]);
            fileReader.onload = function () {
                const extension = getExtension(files[0].name) ?? "";
                const fileTypeMatch = availableFormats.includes(
                    extension.toLowerCase()
                );

                if (!fileTypeMatch) {
                    showErrorNotification(`File ${files[0].name} unsupported`);
                    return;
                }

                props.setModel({
                    model: fileReader.result,
                    modelName: files[0].name,
                });
            };
        }
    };

    return (
        <Grid className={styles.uploadButton} alignItems="center">
            <Grid className={styles.modelName} title={modelName}>
                {modelName.length > 0 ? `File: ${modelName}` : ""}
            </Grid>
            <Grid>
                <Button
                    variant={modelName.length > 0 ? "outlined" : "contained"}
                    component="label"
                    style={{fontSize: "16px", textTransform: "none"}}
                    className={styles.buttonStyle}
                >
                    {modelName.length > 0
                        ? "Upload a different workpiece"
                        : "Upload workpiece 3D model"}
                    <input
                        hidden
                        onChange={uploadHandler}
                        type="file"
                        accept=".step, .stp"
                    />
                </Button>
            </Grid>
        </Grid>
    );
};

export default connectToState(ModelUploadWidgetBase);
