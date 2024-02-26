import * as React from "react";
import { CircularProgress, Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FeedIcon from "@mui/icons-material/Feed";
import styles from "./BestSuggestionWidget.scss";
import { DEFAULT_IMAGE } from "../ToolRecommendationRightBarWidget/ToolRecommendationRightBarWidget.const";
import { BestSuggestionWidgetBaseProps } from "./BestSuggestionWidget.types";
import {
    GetToolArticleUrl,
    GetToolInCatalogUrl,
} from "~/store/api/endpoints.const";

const BestSuggestionWidgetBase = (props: BestSuggestionWidgetBaseProps) => {
    const { bestSuggestionTools, toolImageSourceUrl } = props;

    return (
        <Grid className={styles.groupWrapper} container>
            <Grid item xs={12}>
                {bestSuggestionTools?.tools.map((tool: any, idx: number) => {
                    return (
                        <Grid
                            key={idx}
                            className={styles.toolContainer}
                            container
                        >
                            <div className={styles.toolsContainer}>
                                <div className={styles.imageContainer}>
                                    {tool.itemNumber in toolImageSourceUrl ? (
                                        <img
                                            className={styles.toolImg}
                                            src={
                                                toolImageSourceUrl[
                                                    tool.itemNumber
                                                ]
                                            }
                                        />
                                    ) : (
                                        <>
                                            <CircularProgress
                                                className={
                                                    styles.toolImgSpinner
                                                }
                                            />
                                            <img
                                                className={styles.toolImg}
                                                src={DEFAULT_IMAGE}
                                            />
                                        </>
                                    )}
                                </div>
                                <div className={styles.toolDetail}>
                                    <div className={styles.toolType}>
                                        {tool.role}
                                    </div>
                                    <div className={styles.toolId}>
                                        {tool.designation}
                                    </div>
                                    <div className={styles.toolDataRow}>
                                        <div className={styles.toolData}>
                                            Item Number
                                        </div>
                                        <div className={styles.toolDataValue}>
                                            {tool.itemNumber}
                                        </div>
                                    </div>
                                    <div className={styles.toolDataRow}>
                                        <div className={styles.toolData}>
                                            Stock
                                        </div>
                                        <div className={styles.toolDataValue}>
                                            <div
                                                className={styles.stockCounter}
                                            >
                                                1
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.toolDataRow}>
                                        <div className={styles.toolData}></div>
                                        <div className={styles.toolDataValue}>
                                            1
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Grid className={styles.buttonsContainer} container>
                                <Grid
                                    item
                                    xs={6}
                                    className="flex justify-center"
                                >
                                    <a
                                        className={styles.buttonsLink}
                                        target="_blank"
                                        href={GetToolArticleUrl(
                                            tool.itemNumber
                                        )}
                                        rel="noreferrer"
                                    >
                                        <InfoIcon
                                            className={styles.buttonIcon}
                                        />
                                        <span>Information</span>
                                    </a>
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    className="flex justify-center"
                                >
                                    <a
                                        className={styles.buttonsLink}
                                        target="_blank"
                                        href={GetToolInCatalogUrl(
                                            tool.designation
                                        )}
                                        rel="noreferrer"
                                    >
                                        <FeedIcon
                                            className={styles.buttonIcon}
                                        />
                                        <span>Catalog</span>
                                    </a>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
};

export default BestSuggestionWidgetBase;
