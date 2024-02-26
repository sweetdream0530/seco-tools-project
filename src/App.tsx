import React, { useEffect, useRef, useState } from "react";

import { Box, CircularProgress, Grid } from "@mui/material";
import { TRANSFORM_MODE } from "./store/transformModes/consts";
import { TOOL_STATE } from "./store/tools/consts";

import NotificationWidget from "./components/NotificationWidget";
import Viewer from "./components/MainViewer/Viewer";
import consts from "./components/MainViewer/Viewer/consts";

import "./App.css";
import ViewCube from "./components/MainViewer/ViewCube";
import { CameraView } from "./components/MainViewer/ViewCube/types";

import MaterialSelectionWidget from "./components/DefineWorkPiece/MaterialSelectionWidget/MaterialSelectionWidget";
import FeaturesViewerWidget from "./components/PlanOperation/FeaturesViewerWidget/FeaturesViewerWidget";

import ToolSuggestionWidget from "./components/ToolsSuggestionWidget/ToolsSuggestionWidget";
import LoginView from "./components/Login/LoginView";
import HeaderComponent from "./components/Header/HeaderComponent/HeaderComponent";
import HomePageComponent from "./components/HomePageComponent/HomePageComponent";
import HeaderTabWidget from "./components/Header/HeaderTabWidget/HeaderTabWidget";
import DefineWorkPieceLeftBarWidget from "./components/DefineWorkPiece/DefineWorkPieceLeftBarWidget/DefineWorkPieceLeftBarWidget";
import PlanOperationLeftBarWidget from "./components/PlanOperation/PlanOperationLeftBarWidget/PlanOperationLeftBarWidget";
import SettingOptionComponent from "./components/MainViewer/SettingOptionComponent/SettingOptionComponent";
import FeatureLoadingWidget from "./components/PlanOperation/FeatureLoadingWidget/FeatureLoadingWidget";
import { ParameterWidget } from "./components/PlanOperation/ParameterWidget/ParameterWidget";
import ToolRecommendationLeftBarWidget from "./components/ToolRecommendation/ToolRecommendationLeftBarWidget/ToolRecommendationLeftBarWidget";
import ToolRecommendationRightBarWidget from "./components/ToolRecommendation/ToolRecommendationRightBarWidget/ToolRecommendationRightBarWidget";
import SummaryLeftBarWidget from "./components/Summary/SummaryLeftBarWidget/SummaryLeftBarWidget";
import SummaryHeaderWidget from "./components/Summary/SummaryHeaderWidget/SummaryHeaderWidget";
import FeedbackWidget from "./components/MainViewer/FeedbackWidget";
import { connectToState } from "./App.connect";
import { AppBaseProps } from "./App.types";
import { useSelector } from "react-redux";
import { getPageNumber } from "./store/data/selectors";
import { selectFeatureRecognizeData } from "./store/model/selectors";
import SummaryToolPackageWidget from "./components/Summary/SummaryToolPackageWidget/SummaryToolPackageWidget";
import SummaryMachiningDetailWidget from "./components/Summary/SummaryMachiningDetailWidget/SummaryMachiningDetailWidget";

function AppBase(props: AppBaseProps) {
    const viewerRef = useRef<Viewer | null>(null);

    const {
        model,
        blank,
        featuresByAxes,
        loading,
        toolsSuggestionEnabled,
        selectedTool,
        selectedTransformMode,
        isUserAuthenticated,
    } = props;

    const {
        selectTool,
        transformPanelTool,
        getUser,
        loadSettings,
        loadApiVersion,
    } = props;

    const { modelName } = useSelector(selectFeatureRecognizeData);

    const [localParams, setLocalParams] = useState({
        mainFrameSize: 12,
        featureViewer: null as any,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [sceneParams, setSceneParams] = useState({
        sceneSize: consts.DEFAULT_GRID_SIZE,
        gridCellsSize: consts.DEFAULT_GRID_CELL_SIZE,
    });

    const setSelectedTool = (newAlignment: string) => {
        selectTool(newAlignment);
    };

    const setToolToDefault = () => {
        selectTool(TOOL_STATE.NAVIGATE);
    };

    const setTransformToolToDefault = () => {
        transformPanelTool(TRANSFORM_MODE.NONE);
    };

    const setSelectedTransformTool = (newAlignment: string) => {
        transformPanelTool(newAlignment as TRANSFORM_MODE);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loadingModel, setLoadingModel] = useState(false);
    const [rotationSpeed, setRotationSpeed] = useState(
        consts.CAMERA_OVER_POINT_ROTATION_SPEED
    );
    const [showMainPage, setShowMainPage] = useState(false);
    const pageNumber = useSelector(getPageNumber);

    const getPreferences = () => {
        const savedPreferences = localStorage.getItem("preferences");
        if (savedPreferences) {
            setRotationSpeed(JSON.parse(savedPreferences)?.rotationSpeed);
        }
    };

    const setShowMainPageValue = () => {
        setShowMainPage(true);
        localStorage.setItem("showMainPage", "true");
    };

    useEffect(() => {
        const isItemExist = localStorage.getItem("apiKey");
        const showMaingPageData = Boolean(localStorage.getItem("showMainPage"));
        setShowMainPage(showMaingPageData);
        if (isItemExist && !isUserAuthenticated) {
            getUser();
        }
    }, []);

    useEffect(() => {
        if (isUserAuthenticated) {
            getPreferences();
            loadApiVersion();

            loadSettings();
        }
    }, [isUserAuthenticated]);

    useEffect(() => {
        if (viewerRef.current && model) {
            viewerRef.current.loadModel(model, blank);
        }
    }, [model]);

    useEffect(() => {
        if (featuresByAxes && featuresByAxes.length > 0) {
            setLocalParams({
                mainFrameSize: 12,
                featureViewer: (
                    <FeaturesViewerWidget viewer={viewerRef.current} />
                ),
            });
        } else {
            setLocalParams({
                mainFrameSize: 12,
                featureViewer: null as any,
            });
        }
    }, [featuresByAxes]);

    const toggleViewCube = (cameraView: CameraView) => {
        viewerRef.current?.toggleViewCube(cameraView);
    };

    const clearObject = () => {
        const scn = viewerRef.current!.getScene();
        for (const object of scn.children) {
            if (object.name == "Gltf" || object.name == "Blank") {
                object.removeFromParent();
            }
        }
    };

    const renderApp = () => {
        if (!isUserAuthenticated) {
            return (
                <>
                    <NotificationWidget />
                    <LoginView />
                </>
            );
        }

        return (
            <>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                    }}
                >
                    {!showMainPage && (
                        <img
                            src="/assets/images/homePageImage.jpeg"
                            className="backgroundImage"
                        ></img>
                    )}
                    <HeaderComponent />
                    <NotificationWidget />
                    <div
                        style={{
                            flexGrow: 1,
                            overflow: "auto",
                        }}
                    >
                        {!showMainPage ? (
                            <HomePageComponent
                                setShowMainPage={setShowMainPageValue}
                            />
                        ) : (
                            <Grid className="App" container>
                                <Grid
                                    item
                                    xs={localParams.mainFrameSize}
                                    style={{
                                        position: "relative",
                                        height: "100%",
                                        flexDirection: "column",
                                        display: "flex",
                                    }}
                                >
                                    <HeaderTabWidget />
                                    {pageNumber === 4 && (
                                        <SummaryHeaderWidget />
                                    )}
                                    <Grid
                                        container
                                        xs={12}
                                        style={{
                                            flexGrow: 1,
                                            overflow: "auto",
                                        }}
                                    >
                                        <Grid
                                            item
                                            xs={3}
                                            style={{
                                                height: "100%",
                                                flexDirection: "column",
                                                display: "flex",
                                            }}
                                        >
                                            {pageNumber === 1 && (
                                                <DefineWorkPieceLeftBarWidget
                                                    removeObject={clearObject}
                                                    viewer={viewerRef.current}
                                                />
                                            )}
                                            {pageNumber === 2 && (
                                                <PlanOperationLeftBarWidget
                                                    viewer={viewerRef.current}
                                                />
                                            )}
                                            {pageNumber === 3 && (
                                                <ToolRecommendationLeftBarWidget
                                                    viewer={viewerRef.current}
                                                />
                                            )}
                                            {pageNumber === 4 && (
                                                <SummaryLeftBarWidget
                                                    viewer={viewerRef.current}
                                                />
                                            )}
                                            {/* <ModelUploadWidget
                                            removeObject={clearObject}
                                        />
                                        <Divider sx={{ mt: 3 }} />
                                        <DataInputWidget
                                            viewer={viewerRef.current}
                                        />
                                       */}
                                        </Grid>
                                        <Grid
                                            item
                                            xs={pageNumber === 4 ? 4 : 6}
                                            style={{
                                                height: "100%",
                                                flexDirection: "column",
                                                display: "flex",
                                                position: "relative",
                                            }}
                                        >
                                            <Viewer
                                                // eslint-disable-next-line no-return-assign, no-param-reassign
                                                featuresByAxes={featuresByAxes}
                                                ref={(ref) =>
                                                    (viewerRef.current = ref)
                                                }
                                                sceneParams={sceneParams}
                                                selectedTool={selectedTool}
                                                selectedTransformMode={
                                                    selectedTransformMode
                                                }
                                                setSelectedTool={
                                                    setSelectedTool
                                                }
                                                setToolToDefault={
                                                    setToolToDefault
                                                }
                                                setTransformToolToDefault={
                                                    setTransformToolToDefault
                                                }
                                                setSelectedTransformTool={
                                                    setSelectedTransformTool
                                                }
                                                setLoadingModel={
                                                    setLoadingModel
                                                }
                                                rotationSpeed={rotationSpeed}
                                                frameSize={
                                                    pageNumber === 4 ? 4 : 6
                                                }
                                            />
                                            <SettingOptionComponent
                                                viewer={viewerRef.current}
                                            ></SettingOptionComponent>
                                            <ViewCube
                                                toggleViewCube={toggleViewCube}
                                            />
                                            <FeedbackWidget />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={pageNumber === 4 ? 5 : 3}
                                            style={{
                                                height: "100%",
                                                flexDirection: "column",
                                                position: "relative",
                                                display: "flex",
                                                overflow:
                                                    pageNumber === 4
                                                        ? "auto"
                                                        : "unset",
                                            }}
                                        >
                                            {pageNumber === 1 && modelName && (
                                                <MaterialSelectionWidget />
                                            )}
                                            {pageNumber === 2 && loading && (
                                                <FeatureLoadingWidget />
                                            )}
                                            {pageNumber === 2 && !loading && (
                                                <ParameterWidget />
                                            )}
                                            {pageNumber === 2 &&
                                                toolsSuggestionEnabled && (
                                                <ToolSuggestionWidget />
                                            )}
                                            {pageNumber === 3 && (
                                                <ToolRecommendationRightBarWidget />
                                            )}
                                            {pageNumber == 4 && (
                                                <SummaryToolPackageWidget />
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {/* {localParams.featureViewer} */}
                                {loading && pageNumber === 1 && (
                                    <Box className="processingSpinner">
                                        <CircularProgress />
                                    </Box>
                                )}
                            </Grid>
                        )}
                    </div>
                </div>
                {pageNumber === 4 && <SummaryMachiningDetailWidget />}
            </>
        );
    };
    return renderApp();
}

export default connectToState(AppBase);
