import { styled } from "@mui/system";
import { grey } from "@mui/material/colors";

interface Props {
    accepted: number;
    disabled: boolean;
}

const UploadContainer = styled("div")<Props>(
    ({ accepted, disabled }) => {
        const getColor = () => {
            switch (true) {
            case Boolean(accepted):
                return "#1565c0";
            case disabled:
                return grey[600];
            default:
                return "#1565c0";
            }
        };

        return {
            color: getColor(),
            borderColor: getColor(),
            cursor: disabled ? "default" : "pointer",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "20px",
            borderWidth: "2px",
            borderRadius: "2px",
            borderStyle: "dashed",
            outline: "none",
            transition: "border 0.24s ease-in-out"
        };
    }
);

export default UploadContainer;
