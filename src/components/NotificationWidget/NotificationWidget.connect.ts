import { connect } from "react-redux";
import { IApplicationState } from "../../store/types";
import { closeNotification } from "~/store/data/actions";

const mapStateToProps = (state: IApplicationState) => {
    const { notifications } = state.data;
    return {
        notifications
    };
};

const mapDispatchToProps = {
    closeNotification
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
