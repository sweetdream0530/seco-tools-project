import {
    TextField,
    styled,
} from "@mui/material";

export default styled(TextField, {
    shouldForwardProp: (props: any) => props !== "focusColor",
})(() => ({
    // input label when focused
    "& label.Mui-focused": {
        color: "#1565c0",
    },
    // focused color for input with variant='standard'
    "& .MuiInput-underline:after": {
        borderBottomColor: "#1565c0",
    },
    // focused color for input with variant='filled'
    "& .MuiFilledInput-underline:after": {
        borderBottomColor: "#1565c0",
    },
    // focused color for input with variant='outlined'
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
            borderColor: "#1565c0",
        },
    },
    "& .MuiOutlinedInput-root:hover": {
        "& fieldset": {
            borderColor: "#1565c0",
        },
    },
}));
