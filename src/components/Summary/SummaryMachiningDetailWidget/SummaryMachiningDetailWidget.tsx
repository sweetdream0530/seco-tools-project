import React from "react";
import Button from "@mui/material/Button";
import styles from "./SummaryMachiningDetailWidget.scss";

const SummaryMachiningDetailWidget: React.FC = () => {
    return (
        <div className={styles.detailContainer}>
            <div className={styles.detailHeader}>
                <div className={styles.HeaderText}>Machining detail</div>
                <Button
                    variant="contained"
                    style={{ textTransform: "none", fontSize: "16px" }}
                >
                    Export
                </Button>
            </div>
            <div className={styles.overviewSection}>
                <div className={styles.overviewHeaderText}>Overview</div>
                <div className={styles.overviewTextSection}>
                    <div>Estimated machining time : 00:00 min</div>
                    <div className={styles.selectedText}>
                        Selected materials:
                    </div>
                    <div className={styles.materialText}>P1 (385 N/mm²)</div>
                </div>
            </div>
            <div className={styles.setupSection}>
                <div className={styles.machineImageSection}>
                    <div className={styles.textStyle}>Straight chamfer</div>
                    <img
                        src="/assets/images/150x150.png"
                        className={styles.machineImage}
                    />
                </div>
                <div className="flex flex-col shrink-0">
                    <div className={styles.subTextStyle}>Strategy</div>
                    <div className={styles.textStyle}>Chamfer milling</div>
                    <img
                        src="/assets/images/150x150.png"
                        className={styles.strategyImage}
                    />
                </div>
                <div className={styles.itemSection}>
                    <div className={styles.subTextStyle}>Items</div>
                    <div className={styles.itemListContainer}>
                        <div className={styles.itemContainer}>
                            <img
                                src="/assets/images/150x150.png"
                                className={styles.itemImage}
                            />
                            <div className={styles.itemTextContainer}>
                                <div className={styles.textStyle}>Holder</div>
                                <div className={styles.roleTextStyle}>
                                    R217.49-1620.RE-XO12-45.3A
                                </div>
                            </div>
                        </div>
                        <div className={styles.itemContainer}>
                            <img
                                src="/assets/images/150x150.png"
                                className={styles.itemImage}
                            />
                            <div className={styles.itemTextContainer}>
                                <div className={styles.textStyle}>Holder</div>
                                <div className={styles.roleTextStyle}>
                                    R217.49-1620.RE-XO12-45.3A
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.cuttingDataInfoSection}>
                    <div className={styles.subTextStyle}>Cutting data</div>
                    <div className={styles.cutDataSection}>
                        <div className={styles.stepSection}>
                            <div className={styles.textStyle}>Step 1</div>
                            <div className="mt-2">
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>Radial engagement (ae)</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.stepSection}>
                            <div className={styles.textStyle}>Step 2</div>
                            <div className="mt-2">
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.stepSection}>
                            <div className={styles.textStyle}>Step 3</div>
                            <div className="mt-2">
                                <div className={styles.cutDataItem}>
                                    <div className={styles.cutDataText}>abc</div>
                                    <div className={styles.cutDataInfoText}>0.090 mm/rev</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SummaryMachiningDetailWidget;
