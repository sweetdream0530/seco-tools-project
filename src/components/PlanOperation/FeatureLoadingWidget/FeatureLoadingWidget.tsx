import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { recognizeFeaturesCancel } from "~/store/model/actions";
import { store } from "~/store";

const FeatureLoadingWidget: React.FC = () => {
    const recognitionCancelHandler = (e: any) => {
        if (!e || !e.target) {
            return;
        }

        store.dispatch(recognizeFeaturesCancel());
    };

    return (
        <div className="flex flex-col justify-center items-center mx-12 my-28">
            <CircularProgress />
            <div className="my-28">
                We are fully running to detect features. It may take some time
            </div>
            <Button
                variant="outlined"
                component="label"
                onClick={recognitionCancelHandler}
                style={{ textTransform: "none", fontSize: "16px" }}
            >
                Abort detection
            </Button>
        </div>
    );
};

export default FeatureLoadingWidget;
