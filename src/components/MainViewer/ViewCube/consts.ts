import { Vector3 } from "three";
import { CameraView } from "./types";

/*
    Cube corners numbering order.
    Edges are described as two corner numbers sorted in ascending order

        7-------6
       /|      /|
      4-+-----5 |
      | Front | |      z+
      | 3-----+-2      | 
      |/      |/       |
      0-------1        +----y+
                      /
                     /x+
*/

export const Views: Record<string, CameraView> = {
    // surfaces
    Front: {
        offset: new Vector3(-1, 0, 0),
        up: new Vector3(0, 0, 1),
    },
    Back: {
        offset: new Vector3(1, 0, 0),
        up: new Vector3(0, 0, 1),
    },
    Left: {
        offset: new Vector3(0, 1, 0),
        up: new Vector3(0, 0, 1),
    },
    Right: {
        offset: new Vector3(0, -1, 0),
        up: new Vector3(0, 0, 1),
    },
    Top: {
        offset: new Vector3(0, 0, -1),
        up: new Vector3(-1, 0, -1),
    },
    Bottom: {
        offset: new Vector3(0, 0, 1),
        up: new Vector3(1, 0, 1),
    },

    // Top surfaces edges:
    // top
    Edge76: {
        offset: new Vector3(1, 0, -1),
        up: new Vector3(0, 0, -1),
    },
    // left
    Edge47: {
        offset: new Vector3(0, 1, -1),
        up: new Vector3(-1, 0, 0),
    },
    // right
    Edge65: {
        offset: new Vector3(0, -1, -1),
        up: new Vector3(-1, 0, 0),
    },
    // bottom
    Edge54: {
        offset: new Vector3(-1, 0, -1),
        up: new Vector3(0, 0, 1),
    },

    // Bottom surfaces edges:
    // top
    Edge01: {
        offset: new Vector3(-1, 0, 1),
        up: new Vector3(0, 0, 1),
    },
    // left
    Edge30: {
        offset: new Vector3(0, 0.5, 0.5),
        up: new Vector3(1, 0, 0),
    },
    // right
    Edge12: {
        offset: new Vector3(0, -0.5, 0.5),
        up: new Vector3(1, 0, 0),
    },
    // bottom
    Edge23: {
        offset: new Vector3(1, 0, 1),
        up: new Vector3(0, 0, -1),
    },

    // Front surfaces edges:
    // top
    Edge45: {
        offset: new Vector3(-1, 0, -1),
        up: new Vector3(0, 0, 1),
    },
    // left
    Edge04: {
        offset: new Vector3(-1, 1, 0),
        up: new Vector3(0, 0, 1),
    },
    // right
    Edge51: {
        offset: new Vector3(-1, -1, 0),
        up: new Vector3(0, 0, 1),
    },
    // bottom
    Edge10: {
        offset: new Vector3(-1, 0, 1),
        up: new Vector3(0, 0, 1),
    },

    // Back surfaces edges:
    // top
    Edge67: {
        offset: new Vector3(1, 0, -1),
        up: new Vector3(0, 0, 1),
    },
    // left
    Edge26: {
        offset: new Vector3(1, -1, 0),
        up: new Vector3(0, 0, 1),
    },
    // right
    Edge73: {
        offset: new Vector3(1, 1, 0),
        up: new Vector3(0, 0, 1),
    },
    // bottom
    Edge32: {
        offset: new Vector3(1, 0, 1),
        up: new Vector3(0, 0, 1),
    },

    // Left surfaces edges:
    // top
    Edge74: {
        offset: new Vector3(0, 1, -1),
        up: new Vector3(0, 0, 1),
    },
    // left
    Edge37: {
        offset: new Vector3(1, 1, 0),
        up: new Vector3(0, 0, 1),
    },
    // right
    Edge40: {
        offset: new Vector3(-1, 1, 0),
        up: new Vector3(0, 0, 1),
    },
    // bottom
    Edge03: {
        offset: new Vector3(0, 1, 1),
        up: new Vector3(0, 0, 1),
    },

    // Right surfaces edges:
    // top
    Edge56: {
        offset: new Vector3(0, -1, -1),
        up: new Vector3(0, 0, 1),
    },
    // left
    Edge15: {
        offset: new Vector3(-1, -1, 0),
        up: new Vector3(0, 0, 1),
    },
    // right
    Edge62: {
        offset: new Vector3(1, -1, 0),
        up: new Vector3(0, 0, 1),
    },
    // bottom
    Edge21: {
        offset: new Vector3(0, -1, 1),
        up: new Vector3(0, 0, 1),
    },

    // Corners
    Corner0: {
        offset: new Vector3(-0.5, 0.5, 0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner1: {
        offset: new Vector3(-0.5, -0.5, 0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner2: {
        offset: new Vector3(0.5, -0.5, 0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner3: {
        offset: new Vector3(0.5, 0.5, 0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner4: {
        offset: new Vector3(-0.5, 0.5, -0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner5: {
        offset: new Vector3(-0.5, -0.5, -0.5),
        up: new Vector3(0, 0, 1),
    },
    Corner6: {
        offset: new Vector3(0.5, -0.5, -0.5),
        up: new Vector3(0, 0, -1),
    },
    Corner7: {
        offset: new Vector3(0.5, 0.5, -0.5),
        up: new Vector3(0, 0, -1),
    },
};
