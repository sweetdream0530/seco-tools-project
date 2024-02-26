import * as React from "react";
import { Dialog, Grid } from "@mui/material";
import { useSelector } from "react-redux";
import styles from "./ToolsSuggestionWidget.scss";
import ToolsAlternativeListWidget from "./ToolsAlternativeListWidget/ToolsAlternativeListWidget";
import { store } from "~/store";
import { closeSuggestionModal } from "~/store/data/actions";
import { fetchBlob } from "~/store/tools/data";
import { connectToState } from "./ToolsSuggestionWidget.connect";
import { ToolsSuggestionWidgetBaseProps } from "./ToolsSuggestionWidget.types";
import { getCutServiceData } from "./ToolsSuggestionWidget.utils";
import BestSuggestionWidget from "./BestSuggestionWidget";
import CuttingDataWidget from "./CuttingDataWidget";
import { getSelectedFeatureHash } from "~/store/model/selectors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ToolSuggestionBaseWidget(props: ToolsSuggestionWidgetBaseProps) {
    let featuresCount = 0;
    const {
        featuresByAxes,
        material
    } = props;

    featuresByAxes.forEach((axis) => {
        featuresCount += axis.features.length;
    });

    const featureHash = useSelector(getSelectedFeatureHash) as string;
    const tools = (global as any).toolList ?? {};
    const { toolRecommendations } = featureHash in tools ? tools[featureHash] : {toolRecommendations: []};
    const bestSuggestionTools = toolRecommendations?.at(0)?.toolAssemblies?.at(0);
    const strategy = toolRecommendations?.at(0)?.strategy;

    const handleClose = () => {
        store.dispatch(closeSuggestionModal());
    };

    const [strategyPanelToggle, setStrategyPanelToggle] = React.useState(true);
    const [alternativeListPanelToggled, alternativeListPanelToggle] = React.useState(true);
    const [cutDataInfo, setCutDataInfo] = React.useState([] as any[]);
    const [imageSourceUrl, setImageSourceUrl] = React.useState("");

    const loadCutData = async () => {
        const cutData = await Promise.all(strategy.steps.map(async (step: any) => {
            return await getCutServiceData(material, step);
        }));
        setCutDataInfo(cutData);
    };

    const downloadImageAndSetSource = async (imageUrl: string) => {
        const image = await fetchBlob(imageUrl);
        image && setImageSourceUrl(URL.createObjectURL(image));
    };

    const prevCountRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        if (featureHash !== undefined && prevCountRef.current !== featureHash) {
            prevCountRef.current = featureHash;
            loadCutData();

            if (strategy?.image?.url) {
                downloadImageAndSetSource(strategy.image.url);
            }
        }
    }, [featureHash]);

    if (!bestSuggestionTools) {
        return (
            <Dialog className={styles.dialogWrapper} onClose={handleClose} open={true}>
                Not found
            </Dialog>
        );
    }

    return (
        <Dialog className={styles.dialogWrapper} onClose={handleClose} open={true}>
            <Grid className={styles.summaryInfobox} container>
                <Grid item xs={12}>
                    We have detected <span className={styles.highlightValue}>{featuresCount}</span> features
                </Grid>
                <Grid item xs={12}>
                    and searched through <span className={styles.highlightValue}>31456</span> tools
                </Grid>
                <Grid item xs={12}>
                    Found this tools package with <span className={styles.highlightValue}>{toolRecommendations.length}</span> items for your workpiece.
                </Grid>
            </Grid>
            <BestSuggestionWidget featureHash={featureHash} bestSuggestionTools={bestSuggestionTools} />
            <Grid className={styles.groupWrapper} container>
                <Grid className={styles.groupLabel} onClick={() => setStrategyPanelToggle(!strategyPanelToggle)} item xs={12}>
                    Strategy: {strategy.displayName}
                </Grid>
                {imageSourceUrl.length > 0
                    ? (
                        <Grid style={strategyPanelToggle ? { display: "none" } : {}} className={styles.panelContainer} item xs={12}>
                            <img className={styles.strategyImage} src={imageSourceUrl} alt={strategy.displayName} />
                        </Grid>)
                    :
                    null
                }
            </Grid>
            <CuttingDataWidget material={material} cutDataInfo={cutDataInfo} strategy={strategy} />
            <Grid className={styles.groupWrapper} container>
                <Grid onClick={() => { alternativeListPanelToggle(!alternativeListPanelToggled); }} className={styles.groupLabel} item xs={12}>
                    Alternative list ({toolRecommendations.length})
                </Grid>
                <Grid style={alternativeListPanelToggled ? { display: "none" } : {}} item xs={12}>
                    <ToolsAlternativeListWidget tools={toolRecommendations} />
                </Grid>
            </Grid>
        </Dialog>
    );
}

export default connectToState(ToolSuggestionBaseWidget);