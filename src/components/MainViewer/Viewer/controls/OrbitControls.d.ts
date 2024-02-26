// eslint-disable-next-line max-classes-per-file
import {
    Camera, MOUSE, TOUCH, Vector3,
} from "three";

export class OrbitControls {
    constructor(
    object: Camera,
    domElement?: HTMLElement,
    helperVectorUp?: Vector3
  );

    object: Camera;

    domElement: HTMLElement | HTMLDocument;

    helperVectorUp: Vector3;

    // API
    enabled: boolean;

    target: Vector3;

    // deprecated
    center: Vector3;

    minDistance: number;

    maxDistance: number;

    minZoom: number;

    maxZoom: number;

    minPolarAngle: number;

    maxPolarAngle: number;

    minAzimuthAngle: number;

    maxAzimuthAngle: number;

    enableDamping: boolean;

    dampingFactor: number;

    enableZoom: boolean;

    zoomSpeed: number;

    enableRotate: boolean;

    rotateSpeed: number;

    enablePan: boolean;

    panSpeed: number;

    screenSpacePanning: boolean;

    keyPanSpeed: number;

    autoRotate: boolean;

    autoRotateSpeed: number;

    enableKeys: boolean;

    keys: { LEFT: number; UP: number; RIGHT: number; BOTTOM: number };

    mouseButtons: { LEFT: MOUSE; MIDDLE: MOUSE; RIGHT: MOUSE };

    touches: { ONE: TOUCH; TWO: TOUCH };

    zoomToPointFlag: boolean;

    rotationPointFlag: boolean;

    zoomPoint: Vector3;

    handleMouseMoveDolly: boolean;

    update(): boolean;

    saveState(): void;

    reset(): void;

    dispose(): void;

    getCurrentZoom(): number;

    setCurrentZoom(newZoom: number): void;

    getCurrentState(): any;

    getPolarAngle(): number;

    getAzimuthalAngle(): number;

    zoomToPointWithControls(zoomPoint: Vector3, zoomFactor: number): void;

    dollyIn(dollyScale: number): void;

    // EventDispatcher mixins
    addEventListener(type: string, listener: (event: any) => void): void;

    hasEventListener(type: string, listener: (event: any) => void): boolean;

    removeEventListener(type: string, listener: (event: any) => void): void;

    dispatchEvent(event: { type: string; target?: any }): void;
}

export class MapControls extends OrbitControls {
    constructor(object: Camera, domElement?: HTMLElement);
}
