import React from "react";
import styles from "./SummaryHeaderWidget.scss";
import { styled } from "@mui/material/styles";
import StarBorder from "@mui/icons-material/StarBorder";
import Button, { ButtonProps } from "@mui/material/Button";

const SummaryButton = styled(Button)<ButtonProps>(() => ({
    color: "#fff",
    textTransform: "none",
    backgroundColor: "#333",
    "&:hover": {
        backgroundColor: "#666",
    },
}));

const SummaryHeaderWidget: React.FC = () => {
    return <div className="flex flex-col py-8">
        <div className={styles.titleSection}>
            <div className={styles.headerText}>Example Model</div>
            <SummaryButton variant="contained" startIcon={<StarBorder />}>Save summary</SummaryButton>
        </div>
        <div className={styles.detailSection}>
            <div className={styles.detailText}>45 features are detected <br/>A tool package of 10 tools is suggested</div>
            <Button variant="outlined" sx={{height: 40}}> Feedback</Button>
        </div>
    </div>;
};

export default SummaryHeaderWidget;
