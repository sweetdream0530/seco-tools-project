import { Direction } from "~/store/model/types";

export const getDirectionLabel = (direction: Direction) => {
    if (direction.x.toString() === "1.0000") {
        return "X (Front)";
    }
    if (direction.x.toString() === "-1.000") {
        return "-X (Back)";
    }
    if (direction.y.toString() === "1.0000") {
        return "Y (Left)";
    }
    if (direction.y.toString() === "-1.000") {
        return "-Y (Right)";
    }
    if (direction.z.toString() === "1.0000") {
        return "Z (Top)";
    }
    if (direction.z.toString() === "-1.000") {
        return "-Z (Bottom)";
    }
    return "Unknown features";
};