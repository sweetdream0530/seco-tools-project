import { connect } from "react-redux";
import { loading, loadingDone } from "~/store/data/actions";

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = {
    loading,
    loadingDone
};
// connect pass exactly how we want to connect the component
// the first argument is the data received by the director
// the second argument is the functions that will change the information in the page through the reducer
export const connectToState = (component: any): any => connect(mapStateToProps, mapDispatchToProps)(component);
