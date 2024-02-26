import { connect } from "react-redux";
import { IApplicationState } from "../../store/types";
import { setSettings } from "~/store/data/actions";

const mapStateToProps = (state: IApplicationState) => {
    const { settings, versions } = state.data;
    return {
        settings,
        versions
    };
};

const mapDispatchToProps = {
    setSettings
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
