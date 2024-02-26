/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as THREE from "three";
import {
    Camera, Line3, Object3D, Vector3,
} from "three";
import consts from "~/components/MainViewer/Viewer/consts";

type MouseButtons = {
  [key in "LEFT" | "MIDDLE" | "RIGHT"]: THREE.MOUSE;
};

interface OrbitModes {
  [key: string]: {
    mouseButtons: MouseButtons;
  };
}

// setting orbitControls mouseButtons depending on mode selected ( draw / navigate / pan / rotate scene)

export const setOrbitControls = (index: string) => {
    const ORBIT_MODES: OrbitModes = {
        draw: {
            mouseButtons: {
                LEFT: null!,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: null!,
            },
        },
        navigate: {
            // Also known as "select mode"
            mouseButtons: {
                LEFT: null!,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: null!,
            },
        },
        pan: {
            mouseButtons: {
                LEFT: THREE.MOUSE.PAN,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: null!,
            },
        },
        rotateScene: {
            mouseButtons: {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: null!,
            },
        },
        showFasteners: {
            mouseButtons: {
                LEFT: THREE.MOUSE.ROTATE,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: THREE.MOUSE.ROTATE,
            },
        },
        measure: {
            mouseButtons: {
                LEFT: null!,
                MIDDLE: THREE.MOUSE.ROTATE,
                RIGHT: null!,
            },
        },
    };

    return ORBIT_MODES[index];
};

export const areEqual = (
    left: number,
    right: number,
    epsilon = consts.STANDARD_PRECISION,
): boolean => Math.abs(left - right) < epsilon;

export function getCameraToPointerLineFromEvent(
    event: MouseEvent,
    camera: Camera,
): Line3 {
    const rect = (event.target as HTMLElement).getBoundingClientRect();

    const mouseVector = new Vector3(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * -2 + 1,
        1,
    );

    mouseVector.unproject(camera);

    return new Line3(camera.position, mouseVector);
}

export const getAABBox = (
    object: THREE.Object3D,
    useMetadata = true,
): THREE.Box3 => {
    if (!(object instanceof Object3D) || !useMetadata) {
        return new THREE.Box3().setFromObject(object);
    }

    const baseObject = object as Object3D;
    let boundingBox = null;

    boundingBox = new THREE.Box3().setFromObject(baseObject);
    return boundingBox;
};

export function animate({
    timing,
    draw,
    duration,
    afterEnd,
}: {
  timing: (t: number) => number;
  draw: (t: number) => void;
  afterEnd?: () => void;
  duration: number;
}) {
    const start = performance.now();

    // eslint-disable-next-line no-shadow
    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        const progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        } else {
            // eslint-disable-next-line no-unused-expressions
            afterEnd && afterEnd();
        }
    });
}

export default {
    setOrbitControls,
    areEqual,
    getCameraToPointerLineFromEvent,
    getAABBox,
    animate
};
