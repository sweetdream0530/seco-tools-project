import * as THREE from "three";
import consts from "../consts";

export default class Camera extends THREE.OrthographicCamera {
    constructor(
        defaultPosition: THREE.Vector3,
        lookAt: THREE.Vector3,
        customAspectRaio?: number
    ) {
        const aspectRatio =
      customAspectRaio || window.innerWidth / window.innerHeight;

        super(
            -600 * aspectRatio,
            600 * aspectRatio,
            600,
            -600,
            0.1,
            300
            // consts.DEFAULT_CAMERA_FOV,
            // window.innerWidth / window.innerHeight,
            // consts.DEFAULT_CAMERA_NEAR,
            // consts.DEFAULT_CAMERA_FAR
        );

        this.position.set(defaultPosition.x, defaultPosition.y, defaultPosition.z);

        this.up.copy(new THREE.Vector3(0, 0, 1));

        this.lookAt(lookAt);
    }

    public setZoom(newZoom: number) {
        if (newZoom <= consts.DEFAULT_CAMERA_MIN_ZOOM) {
            this.zoom = consts.DEFAULT_CAMERA_MIN_ZOOM;
        } else if (newZoom >= consts.DEFAULT_CAMERA_MAX_ZOOM) {
            this.zoom = consts.DEFAULT_CAMERA_MAX_ZOOM;
        } else {
            this.zoom = newZoom;
        }
        this.updateProjectionMatrix();
    }
}
