import { connect } from "react-redux";
import { IApplicationState } from "../../../store/types";
import { resetDataState } from "~/store/data/actions";
import { resetModelState, setModel } from "~/store/model/actions";

const mapStateToProps = (state: IApplicationState) => {
    const { modelName } = state.model;
    return {
        modelName
    };
};

const mapDispatchToProps = {
    resetDataState,
    resetModelState,
    setModel
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
