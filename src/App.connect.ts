import { connect } from "react-redux";
import { IApplicationState } from "./store/types";
import { selectTool } from "./store/tools/actions";
import { transformPanelTool } from "./store/transformModes/actions";
import { getUser } from "./store/auth/actions";
import { loadApiVersion, loadSettings } from "./store/data/actions";

const mapStateToProps = (state: IApplicationState) => {
    const { loading, settings, suggestionModalEnabled } = state.data;
    const { model, featuresByAxes, blank } = state.model;
    const { isUserLoggedIn } = state.auth;
    const { selectedTransformMode } = state.transformModes;
    const { selectedTool } = state.tools;
    return {
        model,
        blank,
        featuresByAxes,
        loading,
        toolsSuggestionEnabled: suggestionModalEnabled,
        settings,
        selectedTool,
        selectedTransformMode,
        isUserAuthenticated: isUserLoggedIn
    };
};

const mapDispatchToProps = {
    selectTool,
    transformPanelTool,
    getUser,
    loadSettings,
    loadApiVersion
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
