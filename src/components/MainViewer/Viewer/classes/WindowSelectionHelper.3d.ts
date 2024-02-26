import { Vector2, Scene, OrthographicCamera } from "three";

import Viewer from "../Viewer";

export default class WindowSelectionHelper {
    public isMouseDown = false;

    public isActive = false;

    private startPoint: Vector2;

    private viewer: Viewer;

    private scene: Scene;

    private camera: OrthographicCamera;

    constructor(viewer: Viewer) {
        this.viewer = viewer;
        this.camera = viewer.getCamera();
        this.scene = viewer.getScene();
    }

    public setStartPoint(clientX: number, clientY: number) {
        this.isMouseDown = true;
        this.startPoint = new Vector2(clientX, clientY);
    }
}
