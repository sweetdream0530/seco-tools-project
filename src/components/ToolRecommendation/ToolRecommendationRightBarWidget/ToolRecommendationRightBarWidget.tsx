import React from "react";
import { Collapse, Grid, CircularProgress } from "@mui/material";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ToolRecommendationRightBarWidgetProps } from "./ToolRecommendationRightBarWidget.types";
import { connectToState } from "./ToolRecommendationRightBarWidget.connect";
import BestSuggestionWidget from "../BestSuggestionWidget";
import { getCutServiceData } from "./ToolRecommendationRightBarWidget.utils";
import { fetchBlob } from "~/store/tools/data";
import { getSelectedFeatureHash } from "~/store/model/selectors";
import { useSelector } from "react-redux";
import styles from "./ToolRecommendationRightBarWidget.scss";
import { fetchToolImage } from "~/store/tools/data";
import { DEFAULT_IMAGE } from "../ToolRecommendationRightBarWidget/ToolRecommendationRightBarWidget.const";
import CuttingDataWidget from "../CuttingDataWidget";
import ToolsAlternativeListWidget from "../ToolsAlternativeListWidget";
import { store } from "~/store";
import { getCutDataInfo, getToolImageSourceUrl } from "~/store/data/selectors";
import { setCutDataInfo, setToolImageSourceUrl } from "~/store/data/actions";

interface ExpandType {
    [key: string]: boolean;
}

const ToolRecommendationRightBarWidget: React.FC<
    ToolRecommendationRightBarWidgetProps
> = (props: ToolRecommendationRightBarWidgetProps) => {
    const { material } = props;
    const featureHash = useSelector(getSelectedFeatureHash) as string;
    const tools = (global as any).toolList ?? {};
    const { toolRecommendations } =
        featureHash in tools ? tools[featureHash] : { toolRecommendations: [] };
    const bestSuggestionTools = toolRecommendations
        ?.at(0)
        ?.toolAssemblies?.at(0);

    const strategy = toolRecommendations?.at(0)?.strategy;
    const toolImageSourceUrl = useSelector(getToolImageSourceUrl);
    const cutDataInfo = useSelector(getCutDataInfo);

    const [imageSourceUrl, setImageSourceUrl] = React.useState("");

    const loadCutData = async () => {
        const cutData = await Promise.all(
            strategy.steps.map(async (step: any) => {
                return await getCutServiceData(material, step);
            })
        );
        store.dispatch(setCutDataInfo(cutData));
    };

    const downloadImageAndSetSource = async (imageUrl: string) => {
        const image = await fetchBlob(imageUrl);
        image && setImageSourceUrl(URL.createObjectURL(image));
    };

    const [expanded, setExpanded] = React.useState({
        suggested_tools: false,
        cutting_data: false,
        strategy: false,
        alternative_list: false,
    } as ExpandType);

    const handleExpandClick = (axis: string): void => {
        const prop1 = { ...expanded, [axis]: !expanded[axis] };
        setExpanded(prop1);
    };

    const prevCountRef = React.useRef<string | undefined>(undefined);
    React.useEffect(() => {
        if (featureHash !== undefined && prevCountRef.current !== featureHash) {
            prevCountRef.current = featureHash;
            if (strategy?.steps) loadCutData();

            bestSuggestionTools?.tools.map((tool: any) => {
                downloadToolImageAndSetSource(tool.itemNumber);
            });
            if (strategy?.image?.url) {
                downloadImageAndSetSource(strategy.image.url);
            }
        }
    }, [featureHash]);

    const downloadToolImageAndSetSource = async (toolItemNumber: string) => {
        if (toolImageSourceUrl[toolItemNumber]) return;
        const toolImage = await fetchToolImage(toolItemNumber);
        const url = toolImage ? URL.createObjectURL(toolImage) : DEFAULT_IMAGE;
        store.dispatch(
            setToolImageSourceUrl((toolImageSourceUrl: any) => ({
                ...toolImageSourceUrl,
                [toolItemNumber]: url,
            }))
        );
    };

    if (!featureHash) {
        return <></>;
    }

    if (!bestSuggestionTools) {
        return (
            <>
                <div
                    className="py-2 pl-6 pr-4 cursor-pointer flex justify-between"
                    onClick={() => handleExpandClick("suggested_tools")}
                >
                    Suggested Tools
                    <div className="text-[#006CEA]">
                        {expanded.suggested_tools ? <Remove /> : <Add />}
                    </div>
                </div>
                <div className={styles.noTool}>
                    No tool found for this feature
                </div>
            </>
        );
    }

    return (
        <>
            <div className={styles.toolsContainer}>
                <div
                    style={
                        !expanded.alternative_list ? { display: "none" } : {}
                    }
                    className={styles.alternative_list}
                >
                    <ToolsAlternativeListWidget tools={toolRecommendations} />
                </div>
                <div className="text-left">
                    <>
                        <div
                            className="py-2 pl-6 pr-4 cursor-pointer flex justify-between border border-solid border-[#99C4F7]"
                            onClick={() => handleExpandClick("suggested_tools")}
                        >
                            Suggested Tools
                            <div className="text-[#006CEA]">
                                {expanded.suggested_tools ? (
                                    <Remove />
                                ) : (
                                    <Add />
                                )}
                            </div>
                        </div>
                        {!expanded.suggested_tools &&
                            bestSuggestionTools.tools.length && (
                            <div className="flex flex-wrap">
                                {bestSuggestionTools?.tools.map(
                                    (tool: any, idx: number) => (
                                        <div
                                            className="mx-6 my-2 flex items-center flex-col justify-center"
                                            key={idx}
                                        >
                                            <div className="relative flex items-center flex-col justify-center">
                                                {tool.itemNumber in
                                                    toolImageSourceUrl ? (
                                                        <img
                                                            className={
                                                                styles.toolImg
                                                            }
                                                            src={
                                                                toolImageSourceUrl[
                                                                    tool
                                                                        .itemNumber
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
                                                                className={
                                                                    styles.toolImg
                                                                }
                                                                src={
                                                                    DEFAULT_IMAGE
                                                                }
                                                            />
                                                        </>
                                                    )}
                                            </div>
                                            <div>{tool.role}</div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                        <Collapse
                            in={expanded.suggested_tools}
                            timeout="auto"
                            unmountOnExit
                        >
                            <div className="px-4 py-2 border border-solid border-green-400 bg-green-100">
                                {`Used for ${
                                    bestSuggestionTools.tools.length
                                } other ${
                                    bestSuggestionTools.tools.length > 1
                                        ? "features"
                                        : "feature"
                                }`}
                            </div>
                            <BestSuggestionWidget
                                featureHash={featureHash}
                                bestSuggestionTools={bestSuggestionTools}
                                toolImageSourceUrl={toolImageSourceUrl}
                            />
                        </Collapse>
                        <div
                            className="py-2 pl-6 pr-4 cursor-pointer flex justify-between border border-solid border-[#99C4F7]"
                            onClick={() => handleExpandClick("cutting_data")}
                        >
                            Cutting Data
                            <div className="text-[#006CEA]">
                                {expanded.cutting_data ? <Remove /> : <Add />}
                            </div>
                        </div>
                        <Collapse
                            in={expanded.cutting_data}
                            timeout="auto"
                            unmountOnExit
                        >
                            <CuttingDataWidget
                                material={material}
                                cutDataInfo={cutDataInfo}
                                strategy={strategy}
                            />
                        </Collapse>
                        <div
                            className="py-2 pl-6 pr-4 cursor-pointer flex justify-between border border-solid border-[#99C4F7]"
                            onClick={() => handleExpandClick("strategy")}
                        >
                            Strategy: {strategy.displayName}
                            <div className="text-[#006CEA]">
                                {expanded.strategy ? <Remove /> : <Add />}
                            </div>
                        </div>
                        <Collapse
                            in={expanded.strategy}
                            timeout="auto"
                            unmountOnExit
                        >
                            {imageSourceUrl.length > 0 ? (
                                <Grid
                                    className={styles.panelContainer}
                                    item
                                    xs={12}
                                >
                                    <img
                                        className={styles.strategyImage}
                                        src={imageSourceUrl}
                                        alt={strategy.displayName}
                                    />
                                </Grid>
                            ) : null}
                        </Collapse>
                        <div
                            className="py-2 pl-6 pr-4 cursor-pointer flex justify-between border border-solid border-[#99C4F7]"
                            onClick={() =>
                                handleExpandClick("alternative_list")
                            }
                        >
                            <div className="text-[#006CEA]">
                                {expanded.alternative_list ? (
                                    <ArrowBackIosIcon />
                                ) : (
                                    <ArrowForwardIosIcon />
                                )}
                            </div>
                            Alternative list
                        </div>
                    </>
                </div>
            </div>
        </>
    );
};

export default connectToState(ToolRecommendationRightBarWidget);
