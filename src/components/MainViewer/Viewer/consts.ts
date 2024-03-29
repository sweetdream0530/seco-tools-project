import { Vector3 } from "three";

const INCH_TO_MM = 25.4;
const MM_TO_INCH = 1 / INCH_TO_MM;

const directions: { [index: string]: Vector3 } = {
    X: new Vector3(1, 0, 0),
    "-X": new Vector3(-1, 0, 0),
    Y: new Vector3(0, 1, 0),
    "-Y": new Vector3(0, -1, 0),
    Z: new Vector3(0, 0, 1),
    "-Z": new Vector3(0, 0, -1),
};

const axes: { [index: string]: "X" | "Y" | "Z" | "-X" | "-Y" | "-Z" } = {
    positiveX: "X",
    negativeX: "-X",
    positiveY: "Y",
    negativeY: "-Y",
    positiveZ: "Z",
    negativeZ: "-Z",
};

const positiveAxes: { [index: string]: "X" | "Y" | "Z" } = {
    positiveX: "X",
    positiveY: "Y",
    positiveZ: "Z",
};

export default {
    BUTTONS: {
        LEFT: 0,
        MIDDLE: 1,
        RIGHT: 2,
    },
    CANVAS_ID: "canvasViewer",
    TRIAD_CANVAS_ID: "triadViewer",
    LABEL_CANVAS_ID: "labelViewer",
    VIEWCUBE_ID: "cube",
    FPS_COUNTER_ID: "fps-counter",
    TRIAD_LENGTH: 5.5,                    // triad start
    TRIAD_ARROW_LENGTH: 2,
    TRIAD_ARROW_WIDTH: 1,
    TRIAD_COLOR_X: 0xff0000,
    TRIAD_COLOR_Y: 0x00ff00,
    TRIAD_COLOR_Z: 0x0000ff,
    TRIAD_LABEL_DISTANCE: 7,
    TRIAD_SPHERE_SIZE: 0.5,
    TRIAD_DISTANCE_TO_CAMERA: -7.5,
    TRIAD_SCREEN_OFFSET_LEFT_PX: 410,
    TRIAD_SCREEN_OFFSET_BOTTOM_PX: 70,    // triad end

    BUILD_PLANE_RENDER_ORDER: 5,
    DEFAULT_CAMERA_POSITION: { x: 80, y: 80, z: 80 }, // changed from previous 450-450-450
    DEFAULT_CAMERA_FOV: 120,
    DEFAULT_CAMERA_NEAR: 0.1,
    DEFAULT_CAMERA_FAR: 100, // changed from previous 20000
    DEFAULT_CAMERA_ZOOM: 10,
    DEFAULT_CAMERA_MIN_ZOOM: 0.01,
    DEFAULT_CAMERA_MAX_ZOOM: 100,
    DEFAULT_CAMERA_ZOOM_STEP: 0.5,
    DEFAULT_ZOOM_TO_POINT_DISTANCE: 100,
    DEFAULT_GRID_SIZE: 240,
    DEFAULT_GRID_CELL_SIZE: 12,
    DEFAULT_GRID_DIVISIONS_PER_CELL: 48,
    DEFAULT_GRID_SIZE_SI: 6000 * MM_TO_INCH,
    DEFAULT_GRID_CELL_SIZE_SI: 250 * MM_TO_INCH,
    DEFAULT_GRID_DIVISIONS_PER_CELL_SI: 50, // subcell size is 5 mm
    DEFAULT_GRID_MAJOR_COLOR: 0xdadada,
    DEFAULT_GRID_MINOR_COLOR: 0xa1a1a1,
    DEFAULT_SUBGRID_COLOR: 0xdadada,
    DEFAULT_GRID_BACKGROUND_COLOR: 0xF7FDFF,
    DEFAULT_METAL_BASE_MATERIAL_COLOR: 0x999999,
    DEFAULT_DARK_METAL_BASE_MATERIAL_COLOR: 0x555555,
    DEFAULT_PANEL_CUBE_SIZE: 0.2,
    PANEL_CUBE_COLOR: 0x0632ac,
    HIGHLIGHTED_PANEL_CUBE_COLOR: 0xe15e37,
    DELTA_X_LEADER_COLOR: 0xe51849,
    DELTA_Y_LEADER_COLOR: 0x2bb985,
    DELTA_Z_LEADER_COLOR: 0x1157d7,
    DELTA_X_LABEL_PREFIX: "ΔX",
    DELTA_Y_LABEL_PREFIX: "ΔY",
    DELTA_Z_LABEL_PREFIX: "ΔZ",
    DISTANCE_LABEL_PREFIX: "Δ",
    POINT_CUBE_COLOR: 0xe15e37,
    POINT_CUBE_OPACITY: 0.75,
    POINT_CUBE_SIZE: 0.04,
    POINT_CUBE_VERTEX_SNAP_RADIUS: 0.25,
    MEASUREMENT_GRID_OPACITY: 0.25,
    ROTATION_ANGLE_ADJUSTMENT_COEFFICIENT: 10000,
    CAMERA_OVER_POINT_ROTATION_SPEED: 100,
    LIGHT_COLOR: 0xffffff,
    CLEAR_COLOR: 0xffffff,
    OUTER_BOX_PADDING: 0,
    OUTER_BOX_COLOR: 0x0661ac,
    OUTER_BOX_OPACITY: 0.25,
    COLLISION_BOX_COLOR: 0xf44336,
    RED_COLOR: 0xff0000,
    GREEN_COLOR: 0x00ff00,
    TERRACOTTA_COLOR: 0xe15e37,
    TERRACOTTA_COLOR_VECTOR: new Vector3(0xe1 / 255, 0x5e / 255, 0x37 / 255),
    SLOT_CENTER_FOUND_COLOR: 0x50fffd,
    DEFAULT_CONNECTION_SPHERE_RADIUS: 0.5,
    INCREASED_CONNECTION_SPHERE_RADIUS: 0.75,
    MINIMUM_SCALE_LIMIT_Z: 0,
    INSERTED_OBJECT_ROTATION_THRESHOLD: 1,
    CLOSEST_NEIGHBOR_DISTANCE_THRESHOLD: 2.0,
    CLOSEST_PERPENDICULAR_SLOT_THRESHOLD: 0.5,
    DEFAULT_SCALING_DIRECTION: "-Z",
    DIRECTIONS_LIST: directions,
    DP_UP_DIR: directions["-Z"],
    DP_WIDTH_COMPONENT_INDEX: 0,
    DP_HEIGHT_COMPONENT_INDEX: 1,
    DP_LENGTH_COMPONENT_INDEX: 2,
    AXES: axes,
    POSITIVE_AXES: positiveAxes,
    HALF_PI: Math.PI / 2,
    FLOAT_EPSILON: 1e-8,
    TWO_FLOAT_EPSILON: 1e-2,
    THREE_FLOAT_EPSILON: 1e-3,
    STANDARD_PRECISION: 1e-5,
    MIN_DISTANCE_FROM_CAMERA_TO_TARGET: 0.7,
    MAX_DISTANCE_FROM_CAMERA_TO_TARGET: 160,
    ZOOM_TO_FIT_ADDITIONAL_SIZE_COEF: 1.25,
    SCREENSHOT_SIDE_LENGTH_PX: 1096,
    ISOMETRIC_SCREENSHOT_SIDE_LENGTH_PX: 166,
    LEADER_COLOR: 0x404040,
    DASH_LENGTH: 0.5,
    GAP_LENGTH: 0.5,
    ARROW_HEAD_MIN_DISPLAY_DISTANCE: 2,
    ARROW_HEAD_LENGTH: 1,
    ARROW_HEAD_WIDTH: 0.5,
    COLOR_LERP_OPACITY: 0.4,
    ZOOM_FOR_ZOOM_BUTTONS: 0.0625,
    MIN_WIDTH: 100,
    MIN_HEIGHT: 100,
    HEADER_HEIGHT: 136,
};
