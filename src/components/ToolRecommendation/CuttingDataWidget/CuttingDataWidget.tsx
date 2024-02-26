import { Grid, Tab, Tabs } from "@mui/material";
import * as React from "react";

import styles from "./CuttingDataWidget.scss";
import CustomTabPanelWidget from "../CustomTabPanelWidget";
import { CuttingDataWidgetBaseProps } from "./CuttingDataWidget.types";

const CuttingDataWidgetBase = (props: CuttingDataWidgetBaseProps) => {
    const { strategy, material, cutDataInfo } = props;

    const [cuttingDataTabValue, setCuttingDataTabValue] = React.useState(0);

    const handleCuttingDataTabChange = (
        event: React.SyntheticEvent,
        newValue: number
    ) => {
        setCuttingDataTabValue(newValue);
    };


    return (
        <Grid className={styles.panelContainer} item xs={12}>
            <Tabs
                value={cuttingDataTabValue}
                onChange={handleCuttingDataTabChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
            >
                {strategy.steps.map((step: any, idx: number) => {
                    return <Tab key={idx} label={`Step ${step.id}`} />;
                })}
            </Tabs>
            {strategy.steps.map((step: any, idx: number) => {
                return (
                    <CustomTabPanelWidget
                        key={idx}
                        value={step}
                        material={material}
                        info={cutDataInfo}
                        index={idx}
                        selectedIdx={cuttingDataTabValue}
                    >
                        Item One
                    </CustomTabPanelWidget>
                );
            })}
        </Grid>
    );
};

export default CuttingDataWidgetBase;
