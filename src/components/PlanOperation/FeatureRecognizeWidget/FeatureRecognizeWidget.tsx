import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { useSelector } from "react-redux";
import styles from "./FeatureRecognizeWidget.scss";
import {
    getBlank,
    getSelectAxes,
    selectFeatureRecognizeData,
} from "~/store/model/selectors";
import {
    recognizeFeatures,
    loadFeatures,
    loadFeatureParameter,
    resetFeaturesByAxes,
} from "~/store/model/actions";
import { store } from "~/store";
import { setPageNumber } from "~/store/data/actions";

import { getFeaturesByAxes } from "~/store/model/selectors";
import {
    getRecognizeButtonDisabled,
    selectIsLoading,
} from "~/store/data/selectors";
import { Dialog } from "@mui/material";

export default function FeatureRecognizeWidget(props: any) {
    const { recognitionAvailable, recognitionEnabled, originModel, modelName } =
        useSelector(selectFeatureRecognizeData);

    const [step, setStep] = React.useState(1);
    const [open, setOpen] = React.useState(false);
    const loading = useSelector(selectIsLoading);

    const featuresByAxes = useSelector(getFeaturesByAxes);
    const { settings } = store.getState().data;

    const nextScreen = () => {
        store.dispatch(setPageNumber(3));
    };

    const selectedAxes = useSelector(getSelectAxes) as Array<Array<number>>;
    const blank = useSelector(getBlank);
    const recognizeBtnDisabled = useSelector(getRecognizeButtonDisabled);

    const loadFeaturesHandler = (e: any) => {
        if (!e || !e.target) {
            return;
        }
        store.dispatch(
            loadFeatures({ features: JSON.stringify(featuresByAxes), settings })
        );
        setStep(4);
    };

    const recognitionHandler = (e: any) => {
        if (!e || !e.target) {
            return;
        }

        if (selectedAxes.length > 0) {
            store.dispatch(
                recognizeFeatures({
                    model: originModel,
                    modelName,
                    selectedAxes,
                    blank,
                })
            );
            setStep(2);
        }
    };

    const loadFeatureParameters = (e: any) => {
        if (!e || !e.target) {
            return;
        }
        store.dispatch(
            loadFeatureParameter()
        );
        setStep(4);
    };

    const resetChanges = () => {
        store.dispatch(resetFeaturesByAxes());
        setStep(2);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleBack = () => {
        setOpen(false);
        setStep(2);
    };

    if (!recognitionAvailable || loading) {
        return <></>;
    }

    return (
        <Stack
            className={styles.recognizeButton}
            direction="row"
            alignItems="center"
        >
            {step === 1 ? (
                <Button
                    variant="contained"
                    component="label"
                    disabled={
                        selectedAxes.length === 0 ||
                        !recognitionEnabled ||
                        props.disabled ||
                        recognizeBtnDisabled
                    }
                    onClick={recognitionHandler}
                    style={{ textTransform: "none", fontSize: "16px" }}
                >
                    Scan features
                </Button>
            ) : step === 2 ? (
                <Button
                    variant="contained"
                    component="label"
                    disabled={
                        !recognitionEnabled ||
                        props.disabled ||
                        recognizeBtnDisabled
                    }
                    onClick={() => setStep(3)}
                    style={{ textTransform: "none", fontSize: "16px" }}
                >
                    Confirm list and go set parameters
                </Button>
            ) : step === 3 ? (
                <div className="flex flex-col">
                    <Button
                        variant="contained"
                        component="label"
                        disabled={
                            !recognitionEnabled ||
                            props.disabled ||
                            recognizeBtnDisabled
                        }
                        onClick={() => resetChanges()}
                        style={{ textTransform: "none", fontSize: "16px" }}
                    >
                        Reset changes
                    </Button>{" "}
                    <Button
                        variant="contained"
                        component="label"
                        disabled={
                            !recognitionEnabled ||
                            props.disabled ||
                            recognizeBtnDisabled
                        }
                        onClick={loadFeatureParameters}
                        style={{
                            textTransform: "none",
                            fontSize: "16px",
                            marginTop: "16px",
                        }}
                    >
                        Save changes
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col">
                    <Button
                        disabled={
                            !recognitionEnabled ||
                            props.disabled ||
                            recognizeBtnDisabled
                        }
                        variant="contained"
                        component="label"
                        onClick={() => nextScreen()}
                        className={styles.nextButton}
                        style={{
                            backgroundColor: "#333",
                            color: "white",
                            textTransform: "none",
                        }}
                    >
                        Apply and to next step
                        <ArrowForwardIcon />
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={
                            !recognitionEnabled ||
                            props.disabled ||
                            recognizeBtnDisabled
                        }
                        onClick={() => setOpen(true)}
                        style={{
                            textTransform: "none",
                            fontSize: "16px",
                            marginTop: "16px",
                        }}
                    >
                        Back to arrange operation list
                    </Button>
                </div>
            )}

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
                        Back to arrange operation list might lose the parameters
                        you have set.
                    </div>
                    <div className="flex justify-center gap-6">
                        <Button
                            onClick={handleBack}
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
        </Stack>
    );
}
