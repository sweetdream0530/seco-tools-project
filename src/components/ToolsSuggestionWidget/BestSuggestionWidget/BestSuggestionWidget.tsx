import * as React from "react";
import { CircularProgress, Grid } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import FeedIcon from "@mui/icons-material/Feed";
import styles from "../ToolsSuggestionWidget.scss";
import { DEFAULT_IMAGE } from "../ToolsSuggestionWidget.const";
import { fetchToolImage } from "~/store/tools/data";
import { BestSuggestionWidgetBaseProps } from "./BestSuggestionWidget.types";
import {
    GetToolArticleUrl,
    GetToolInCatalogUrl,
} from "~/store/api/endpoints.const";
import { store } from "~/store";
import { getToolImageSourceUrl } from "~/store/data/selectors";
import { useSelector } from "react-redux";
import { setToolImageSourceUrl } from "~/store/data/actions";

const BestSuggestionWidgetBase = (props: BestSuggestionWidgetBaseProps) => {
    const { bestSuggestionTools, featureHash } = props;

    const [bestSuggestionPanelToggled, setBestSuggestionPanelToggle] =
        React.useState(false);
    const { toolImageSourceUrl } = useSelector(getToolImageSourceUrl);

    const downloadToolImageAndSetSource = async (toolItemNumber: string) => {
        const toolImage = await fetchToolImage(toolItemNumber);
        const url = toolImage ? URL.createObjectURL(toolImage) : DEFAULT_IMAGE;
        store.dispatch(
            setToolImageSourceUrl((toolImageSourceUrl: any) => ({
                ...toolImageSourceUrl,
                [toolItemNumber]: url,
            }))
        );
    };

    const prevCountRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        if (featureHash !== undefined && prevCountRef.current !== featureHash) {
            prevCountRef.current = featureHash;
            bestSuggestionTools?.tools.map((tool: any) => {
                downloadToolImageAndSetSource(tool.itemNumber);
            });
        }
    }, [featureHash]);

    return (
        <Grid className={styles.groupWrapper} container>
            <Grid
                className={styles.groupLabel}
                onClick={() =>
                    setBestSuggestionPanelToggle(!bestSuggestionPanelToggled)
                }
                item
                xs={12}
            >
                Best suggestion
            </Grid>
            <Grid
                style={bestSuggestionPanelToggled ? { display: "none" } : {}}
                className={styles.panelContainer}
                item
                xs={12}
            >
                {bestSuggestionTools?.tools.map((tool: any, idx: number) => {
                    return (
                        <Grid
                            key={idx}
                            className={styles.toolContainer}
                            container
                        >
                            <Grid container>
                                <Grid item xs={4}>
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
                                </Grid>
                                <Grid item xs={8}>
                                    <span className={styles.toolType}>
                                        {tool.role}
                                    </span>
                                    <span className={styles.toolId}>
                                        {tool.designation}
                                    </span>
                                </Grid>
                            </Grid>
                            <Grid className={styles.toolDataRow} container>
                                <Grid item xs={6}>
                                    Item Number
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    className={styles.toolDataValue}
                                >
                                    {tool.itemNumber}
                                </Grid>
                            </Grid>
                            <Grid className={styles.toolDataRow} container>
                                <Grid item xs={6}>
                                    Stock (Home DC / Other DC&apos;s)
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    className={styles.toolDataValue}
                                >
                                    <span className={styles.stockCounter}>
                                        1
                                    </span>
                                    <span className={styles.stockSlash}>/</span>
                                    <span className={styles.stockCounter}>
                                        1
                                    </span>
                                </Grid>
                            </Grid>
                            <Grid className={styles.toolDataRow} container>
                                <Grid item xs={6}>
                                    Min. sales quantity
                                </Grid>
                                <Grid
                                    item
                                    xs={6}
                                    className={styles.toolDataValue}
                                >
                                    1
                                </Grid>
                            </Grid>
                            <Grid className={styles.buttonsContainer} container>
                                <Grid className={styles.buttonItem} item xs={6}>
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
                                <Grid className={styles.buttonItem} item xs={6}>
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
