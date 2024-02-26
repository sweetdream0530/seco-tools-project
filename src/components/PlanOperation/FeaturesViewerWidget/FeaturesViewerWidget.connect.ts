import { connect } from "react-redux";
import { IApplicationState } from "../../../store/types";
import { showSuggestionModal } from "~/store/data/actions";
import { selectFeature, toggleFeaturesByAxis, toggleGroup, setFeaturesByAxesData } from "~/store/model/actions";

const mapStateToProps = (state: IApplicationState) => {
    const { loading } = state.data;
    const { featuresByAxes, selectedFeatureHash, selectedFeature, } = state.model;
    
    return {
        loading,
        featuresByAxes,
        selectedFeatureHash,
        selectedFeature,
    };
};

const mapDispatchToProps = {
    showSuggestionModal,
    selectFeature,
    toggleFeaturesByAxis,
    setFeaturesByAxesData,
    toggleGroup
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
