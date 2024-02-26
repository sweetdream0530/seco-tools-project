import * as React from "react";
import { Box, Grid } from "@mui/material";

import styles from "./CustomTabPanelWidget.scss";
import { CustomTabPanelBaseProps } from "./CustomTabPanelWidget.types";

function CustomTabPanelBaseWidget(props: CustomTabPanelBaseProps) {
    const { index, selectedIdx, info, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={selectedIdx !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {selectedIdx === index && (
                <Box>
                    {info[selectedIdx]?.map((result: any, idx: number) => {
                        return (
                            <Grid key={idx} className={styles.cuttingDataRow}>
                                <span>{result.displayName}</span>
                                <span style={{ float: "right", color: "#333" }}>{`${result.roundedValue} ${result.unit ?? ""}`}</span>
                            </Grid>
                        );
                    })}
                </Box>
            )}
        </div>
    );
}

export default CustomTabPanelBaseWidget;