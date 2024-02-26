import * as THREE from "three";
import consts from "../consts";

export interface IEvent {
  message: string;
  type: string;
}

export interface IMessage {
  scene: THREE.Object3D;
  camera: THREE.OrthographicCamera;
}

export default class RendererHelper extends THREE.WebGLRenderer {
    private scene: THREE.Object3D;

    private camera: THREE.OrthographicCamera;

    constructor(
        canvas: HTMLCanvasElement,
        scene: THREE.Object3D,
        camera: THREE.OrthographicCamera,
        customSize?: THREE.Vector2
    ) {
        super({
            antialias: true,
            canvas,
            preserveDrawingBuffer: true,
        });

        this.camera = camera;
        this.scene = scene;

        this.setPixelRatio(window.devicePixelRatio);
        this.setClearColor(consts.CLEAR_COLOR, 1);
        this.setSize(window.innerWidth, window.innerHeight);
        if (customSize) {
            this.setSize(customSize.x, customSize.y);
        }
    }
}
