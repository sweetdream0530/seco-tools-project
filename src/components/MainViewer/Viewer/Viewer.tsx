/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { Dispatch, SetStateAction } from "react";

import THREE, {
    Vector2,
    Vector3,
    Scene,
    Light,
    Raycaster,
    Box3,
    Mesh,
    SphereGeometry,
    MeshBasicMaterial,
    Sphere,
    WebGLRenderer,
    Color,
    PlaneGeometry,
    DoubleSide,
    Quaternion,
    CircleGeometry,
    Object3D,
    AxesHelper,
    ArrowHelper,
    Group,
    Matrix4,
    OrthographicCamera,
} from "three";
import {
    CSS2DObject,
    CSS2DRenderer,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import tween, { Tween, Easing } from "@tweenjs/tween.js";
import consts from "./consts";
import GridControlsHelper from "./classes/GridControlsHelper.3d";
import RendererHelper from "./classes/RendererHelper.3d";
import OrbitControlsHelper from "./classes/OrbitControlsHelper.3d";
import Camera from "./classes/Camera.3d";
import Utils3d, { animate } from "~/utils/utils3d";
import { TOOL_STATE } from "~/store/tools/consts";
import { CameraView } from "../ViewCube/types";
import LightsHelper from "./classes/LightsHelper";
import FpsCounter from "~/utils/FpsCounter";
import Logger from "~/utils/Logger";
import GltfLoaderService from "./classes/GltfLoader.3d";
import WindowSelectionHelper from "./classes/WindowSelectionHelper.3d";
import { AxesFeatures, IFeature } from "~/store/model/types";
import { store } from "~/store";
import { selectFeature } from "~/store/model/actions";
import stc from "string-to-color";

interface IProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sceneParams: any;
    selectedTool: string;
    selectedTransformMode: string;
    rotationSpeed: number;
    setSelectedTool: (newAlignment: string) => void;
    setToolToDefault: VoidFunction;
    setTransformToolToDefault: VoidFunction;
    setSelectedTransformTool: (newAlignment: string) => void;
    setLoadingModel: Dispatch<SetStateAction<boolean>>;
    frameSize?: number;
    featuresByAxes: AxesFeatures[];
}

const panCursor = "url('assets/cursors/cursor-camera-pinch.cur') 8 8, default";
const rotateCursor =
    "url('assets/cursors/cursor-camera-rotate.cur') 8 8, default";

// Temp objects to use in functions, which are called on every render or just very often
// This made to prevent ineffective object creation
const tempVector1 = new Vector3();

const triadCanvasStyle = {
    position: "absolute",
    left: "0px",
    bottom: "10px",
    pointerEvents: "none",
};

const triadViewerSize = new Vector2(300, 150);
class Viewer extends React.Component<IProps> {
    public raycaster = new Raycaster();

    private rotationCenter?: Vector3;

    private mouse = new Vector2();

    private requestAnimationFrameId?: number;

    public mouseDown = false;

    public gridControlsHelper?: GridControlsHelper;

    public slidePlane?: Mesh;

    private backgroundPlane!: Mesh;

    private windowSelectionTool: WindowSelectionHelper;

    public angleArc?: Mesh;

    private triad: Group = new Group();

    private labelRenderer: CSS2DRenderer;

    // mouse data
    private rotateStart = new Vector2();

    private rotateEnd = new Vector2();

    private rotateDelta = new Vector2();

    private rotationCenterFound = false;

    private rendererHelper?: RendererHelper;

    private rendererHelper2?: RendererHelper;

    private scene!: Scene;

    private triadScene!: Scene;

    private gltfLoader!: GltfLoaderService;

    private orbitControls!: OrbitControlsHelper;

    private axesHelper!: AxesHelper;

    private camera!: Camera;

    private triadCamera!: Camera;

    private intersectionPoint?: Mesh;

    private fpsCounter?: FpsCounter;

    private logger?: Logger;

    private currentGridScaleState = -1;

    private model?: Group;

    private intersected?: any;

    // eslint-disable-next-line react/no-unused-class-component-methods
    public viewCubeEventsEnabled = true;

    private _isImperialMeasurementUsed = true;

    private isBlankVisible = false;

    private selectedFaces: any[] = [];

    private lastMouseActivityTime: number = Date.now();

    private inactivityThreshold = 5000; // 5 seconds

    // eslint-disable-next-line react/sort-comp
    public get isImperialMeasurementUsed() {
        // eslint-disable-next-line no-underscore-dangle
        return this._isImperialMeasurementUsed;
    }

    private set isImperialMeasurementUsed(val: boolean) {
        // eslint-disable-next-line no-underscore-dangle
        this._isImperialMeasurementUsed = val;
    }

    // eslint-disable-next-line react/static-property-placement
    static defaultProps = {};

    constructor(props: IProps) {
        super(props);
        this.state = {};
        // eslint-disable-next-line no-underscore-dangle
        Viewer._instance = this;
        this.init = this.init.bind(this);
        this.checkMouseInactivity = this.checkMouseInactivity.bind(this);
    }

    componentDidMount() {
        this.init();
        const { selectedTool } = this.props;
        this.orbitControls.mouseButtons =
            Utils3d.setOrbitControls(selectedTool).mouseButtons;
    }

    componentDidUpdate(prevProps: Readonly<IProps>): void {
        if (prevProps.frameSize !== this.props.frameSize) {
            this.onResize();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    private getCameraCSSMatrix(matrix: THREE.Matrix4) {
        const { elements } = matrix;
        const epsilon = (value: number) =>
            Math.abs(value) < 1e-10 ? 0 : value;

        return `matrix3d(
        ${epsilon(elements[0])}, ${epsilon(-elements[1])}, ${epsilon(
    elements[2]
)}, 0,
        ${epsilon(elements[4])}, ${epsilon(-elements[5])}, ${epsilon(
    elements[6]
)}, 0,
        ${epsilon(elements[8])}, ${epsilon(-elements[9])}, ${epsilon(
    elements[10]
)}, 0,
          0, 0, 0, 1)`;
    }

    /**
     * Creates a CSS2D Renderer
     * @param {Window | HTMLElement} container
     * @returns CSS2D Renderer
     */
    private createLabelRenderer(): CSS2DRenderer {
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(triadViewerSize.x, triadViewerSize.y);
        labelRenderer.domElement.style.position = triadCanvasStyle.position;
        labelRenderer.domElement.style.bottom = `${triadCanvasStyle.bottom}`;
        labelRenderer.domElement.style.left = `${triadCanvasStyle.left}`;
        labelRenderer.domElement.style.pointerEvents =
            triadCanvasStyle.pointerEvents;
        const labelCanvas = document.getElementById(consts.LABEL_CANVAS_ID);
        if (labelCanvas) labelCanvas.appendChild(labelRenderer.domElement);
        return labelRenderer;
    }

    init = () => {
        THREE.Object3D.DefaultUp = new THREE.Vector3(0, 0, 1);
        const canvasViewer: HTMLCanvasElement = this.getRendererDOMElement();
        this.scene = new Scene();
        this.scene.up.set(0, 0, 1);
        this.scene.background = new Color(consts.DEFAULT_GRID_BACKGROUND_COLOR);

        // init Camera
        const cameraPosition = new Vector3(
            consts.DEFAULT_CAMERA_POSITION.x,
            consts.DEFAULT_CAMERA_POSITION.y,
            consts.DEFAULT_CAMERA_POSITION.z
        );
        this.camera = new Camera(cameraPosition, this.scene.position);
        this.camera.setZoom(consts.DEFAULT_CAMERA_ZOOM);
        this.camera.matrixAutoUpdate = true;
        this.camera.up.set(0, 0, 1);

        this.gltfLoader = new GltfLoaderService(this.scene, this.camera);

        this.backgroundPlane = new Mesh(
            new PlaneGeometry(
                consts.DEFAULT_GRID_SIZE * 2,
                consts.DEFAULT_GRID_SIZE * 2,
                consts.DEFAULT_GRID_SIZE * 2,
                1
            ),
            new MeshBasicMaterial({
                color: 0xdddddd,
                side: DoubleSide,
                // opacity: 0.7,
                // transparent: true,
            })
        );
        this.backgroundPlane.position.set(0, 0, 0);
        this.backgroundPlane.visible = false;
        this.backgroundPlane.lookAt(this.camera.position);
        this.getScene().add(this.backgroundPlane);

        this.getScene().add(this.camera);

        this.rendererHelper = new RendererHelper(
            canvasViewer,
            this.scene,
            this.camera
        );

        this.slidePlane = new Mesh(
            new PlaneGeometry(
                consts.DEFAULT_GRID_SIZE * 5,
                consts.DEFAULT_GRID_SIZE * 5,
                consts.DEFAULT_GRID_SIZE * 5,
                1
            ),
            new MeshBasicMaterial({
                color: 0xdddddd,
                side: DoubleSide,
            })
        );

        this.slidePlane.position.set(0, 0, 0);
        this.slidePlane.visible = false;
        this.slidePlane.name = "slidePlane";
        this.getScene().add(this.slidePlane);

        const arcGeometry = new CircleGeometry(4, 32);
        const arcMaterial = new MeshBasicMaterial({
            color: 0x0662ac,
            opacity: 0.5,
            transparent: true,
        });
        arcMaterial.side = DoubleSide;
        this.angleArc = new Mesh(arcGeometry, arcMaterial);
        this.angleArc.visible = false;

        this.getScene().add(this.angleArc);

        // this.axesHelper = new AxesHelper(5);
        // this.getScene().add(this.axesHelper);

        this.windowSelectionTool = new WindowSelectionHelper(this);

        // init CSS2D renderer
        this.labelRenderer = this.createLabelRenderer();

        // Triad canvas related initialization
        const triadCanvas = this.getTriadRendererDOMElement();

        this.triadScene = new Scene();
        this.triadScene.up.set(0, 0, 1);

        this.triadCamera = new Camera(
            cameraPosition,
            this.triadScene.position,
            2
        );
        this.triadCamera.setZoom(consts.DEFAULT_CAMERA_ZOOM);
        this.triadCamera.matrixAutoUpdate = true;
        this.triadCamera.up.set(0, 0, 1);
        this.triadCamera.zoom = 80;
        this.triadCamera.updateProjectionMatrix();

        this.triadScene.add(this.triadCamera);

        this.rendererHelper2 = new RendererHelper(
            triadCanvas,
            this.triadScene,
            this.triadCamera,
            triadViewerSize
        );
        this.rendererHelper2.setClearColor(0x000000, 0);

        this.initTriad();

        // init GridControls
        // this.gridControlsHelper = new GridControlsHelper(
        //   this,
        //   consts.DEFAULT_GRID_SIZE
        // );

        // this.scene.add(this.gridControlsHelper);

        // init Lights
        const lightsHelper = new LightsHelper();
        lightsHelper.lights.forEach((light: Light) => {
            this.getScene().add(light);
        });

        // init Events
        window.addEventListener("resize", this.onResize.bind(this), false);

        if (process.env.NODE_ENV === "development") {
            this.fpsCounter = new FpsCounter((fps) => {
                const fpsDOMElement = document.getElementById(
                    consts.FPS_COUNTER_ID
                );
                // eslint-disable-next-line no-unused-expressions
                fpsDOMElement &&
                    (fpsDOMElement.innerText = `${Math.round(fps)}`);
            }, 10);

            this.logger = new Logger(1);

            const onAnimationFrame = () => {
                this.fpsCounter?.tick();
                this.logger?.tick();
                requestAnimationFrame(onAnimationFrame);
            };

            requestAnimationFrame(onAnimationFrame);

            document.addEventListener("keydown", (e) => {
                switch (e.keyCode) {
                case 80: // p
                case 221: // ъ ї
                    this.logger?.showStats();
                    break;
                default:
                    break;
                }
            });
        }

        document.addEventListener(
            "keydown",
            this.handleViewerKeyDown.bind(this),
            false
        );

        // Mouse wheel Events on canvas
        document.getElementById(consts.CANVAS_ID)!.addEventListener(
            "wheel",
            // eslint-disable-next-line consistent-return
            (event) => {
                this.lastMouseActivityTime = Date.now();
                if (event.ctrlKey) {
                    // Prevent zoom of webpage if you on canvas+ctrl+downWheel+WheelRotate
                    event.preventDefault();
                    return false;
                }
            },
            { passive: false }
        );

        this.getRendererDOMElement().oncontextmenu = function (e) {
            e.preventDefault();
            return false;
        };

        this.getRendererDOMElement().addEventListener(
            "mousemove",
            this.onMouseMove.bind(this),
            false
        );
        this.getRendererDOMElement().addEventListener(
            "mousedown",
            this.onMouseDown.bind(this),
            false
        );
        this.getRendererDOMElement().addEventListener(
            "mouseup",
            this.onMouseUp.bind(this),
            false
        );
        //this.getRendererDOMElement().addEventListener('mousemove', this.onPointerMove.bind(this), false);

        // init OrbitControls
        this.orbitControls = new OrbitControlsHelper(
            this.camera,
            this.rendererHelper.domElement
        );

        this.orbitControls.enablePan = false;

        this.orbitControls.panSpeed = 1;

        this.updateViewCube();
        this.updateTriad();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.orbitControls.addEventListener("change", (_p) => {
            // Is Used for position the backgroundPlane in front of camera always
            this.backgroundPlane.rotation.setFromRotationMatrix(
                this.camera.matrix
            );
            this.updateViewCube();
            this.updateTriad();
        });

        // add intersection point visualization for testing
        // params and color will be moved to consts later when this point will be used as the rotation centre visualization
        const tinySphere = new SphereGeometry(0.1, 32, 16);
        const material = new MeshBasicMaterial({ color: 0xffff00 });
        this.intersectionPoint = new Mesh(tinySphere, material);
        this.intersectionPoint.position.set(2000, 2000, 2000);
        this.intersectionPoint.visible = false;
        this.getScene().add(this.intersectionPoint);

        this.animate();
        this.onResize();
    };

    private initTriad = (reinit?: boolean) => {
        if (reinit) {
            this.triadCamera.children.forEach((obj) => {
                if (obj.name === "triad") {
                    this.triadCamera.remove(obj);
                }
            });
        }

        const labelXDiv = document.createElement("div");
        labelXDiv.style.color = "rgb(255, 0, 0)";
        labelXDiv.style.display = "block";
        labelXDiv.style.zIndex = "-2";
        labelXDiv.innerHTML = "X";

        const labelYDiv = document.createElement("div");
        labelYDiv.style.color = "rgb(0, 255, 0)";
        labelYDiv.style.display = "block";
        labelYDiv.style.zIndex = "-2";
        labelYDiv.innerHTML = "Y";

        const labelZDiv = document.createElement("div");
        labelZDiv.style.color = "rgb(0, 0, 255)";
        labelZDiv.style.display = "block";
        labelZDiv.style.zIndex = "-2";
        labelZDiv.innerHTML = "Z";

        const labelX = new CSS2DObject(labelXDiv);
        const labelY = new CSS2DObject(labelYDiv);
        const labelZ = new CSS2DObject(labelZDiv);

        labelX.position.set(consts.TRIAD_LABEL_DISTANCE, 0, 0);
        labelY.position.set(0, consts.TRIAD_LABEL_DISTANCE, 0);
        labelZ.position.set(0, 0, consts.TRIAD_LABEL_DISTANCE);

        const origin = new Vector3(0, 0, 0);
        const triadX = new ArrowHelper(
            new Vector3(1, 0, 0),
            origin,
            consts.TRIAD_LENGTH,
            consts.TRIAD_COLOR_X,
            consts.TRIAD_ARROW_LENGTH,
            consts.TRIAD_ARROW_WIDTH
        );
        const triadY = new ArrowHelper(
            new Vector3(0, 1, 0),
            origin,
            consts.TRIAD_LENGTH,
            consts.TRIAD_COLOR_Y,
            consts.TRIAD_ARROW_LENGTH,
            consts.TRIAD_ARROW_WIDTH
        );
        const triadZ = new ArrowHelper(
            new Vector3(0, 0, 1),
            origin,
            consts.TRIAD_LENGTH,
            consts.TRIAD_COLOR_Z,
            consts.TRIAD_ARROW_LENGTH,
            consts.TRIAD_ARROW_WIDTH
        );
        const triadSG = new SphereGeometry(consts.TRIAD_SPHERE_SIZE, 5, 5);
        const sphereMaterial = new MeshBasicMaterial({ color: 0xdddddd });
        const triadSphere = new Mesh(triadSG, sphereMaterial);

        this.triad.add(labelX);
        this.triad.add(labelY);
        this.triad.add(labelZ);

        this.triad.add(triadX);
        this.triad.add(triadY);
        this.triad.add(triadZ);
        this.triad.add(triadSphere);
        this.triad.name = "triad";
        this.triadCamera.add(this.triad);
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    public enableViewCubeEvents = () => {
        this.getViewCubeElement().style.pointerEvents = "all";
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    public disableViewCubeEvents = () => {
        this.getViewCubeElement().style.pointerEvents = "none";
    };

    private updateTriad = (distance?: number) => {
        const vec1 = new Vector3(0, 0, -1);
        const invProj = this.camera.projectionMatrix.clone().invert();
        vec1.applyMatrix4(invProj);

        vec1.setZ(distance ?? consts.TRIAD_DISTANCE_TO_CAMERA);

        this.triad.position.copy(vec1);
        const mat = new Matrix4().extractRotation(
            this.camera.matrixWorldInverse
        );
        this.triad.rotation.setFromRotationMatrix(mat);
        this.triad.updateMatrix();
    };

    private updateViewCube = () => {
        const cube: HTMLDivElement = this.getViewCubeElement();
        if (cube && this.camera) {
            const translateZ: number =
                -parseInt(getComputedStyle(cube).width, 10) / 2;
            cube.style.transform = `translateZ(${translateZ}px) ${this.getCameraCSSMatrix(
                this.camera.matrixWorldInverse
            )}`;
        }
    };

    public zoomToFit = (optBox: Box3 | null): void => {
        if (!optBox) {
            return;
        }
        const boundingSphere = optBox.getBoundingSphere(new Sphere());

        this.camera.setZoom(consts.DEFAULT_CAMERA_ZOOM);
        const distanceToTarget = this.effectiveDistanceToSphere(boundingSphere);
        this.camera.far = distanceToTarget * 10000;
        this.camera.near = distanceToTarget * -10000;
        const initialCameraPosition = this.getCamera().position.clone();
        const initialTarget = this.getControls().target.clone();

        const cameraDirection = new Vector3();
        this.getCamera().getWorldDirection(cameraDirection);

        const newCameraPosition = cameraDirection
            .negate()
            .setLength(distanceToTarget)
            .add(boundingSphere.center);

        const cameraMovement = new Vector3().subVectors(
            newCameraPosition,
            initialCameraPosition
        );
        const targetMovement = new Vector3().subVectors(
            boundingSphere.center,
            initialTarget
        );

        const temp1 = new Vector3();
        const temp2 = new Vector3();

        const renderer = this.getRenderer();
        const aspectRatio =
            renderer.domElement.clientWidth / renderer.domElement.clientHeight;
        const viewFrustumSize =
            aspectRatio < 1
                ? this.camera.right - this.camera.left
                : this.camera.bottom - this.camera.top;
        const scaleFactor = Math.abs(
            viewFrustumSize / (2 * boundingSphere.radius)
        );

        // this.initTriad(true);
        animate({
            timing: (t) => t,
            duration: 300,
            draw: (t) => {
                this.camera.position.copy(
                    temp1.addVectors(
                        initialCameraPosition,
                        temp2.lerp(cameraMovement, t)
                    )
                );
                this.camera.setZoom(scaleFactor);

                this.getControls().target.copy(
                    temp1.addVectors(
                        initialTarget,
                        temp2.lerp(targetMovement, t)
                    )
                );

                this.rendererHelper!.render(this.scene, this.camera);
            },
        });
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    public zoomIn = (): void => {
        this.orbitControls.zoomToPointWithControls(
            this.orbitControls.target,
            consts.ZOOM_FOR_ZOOM_BUTTONS
        );
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    public zoomOut = (): void => {
        this.orbitControls.zoomToPointWithControls(
            this.orbitControls.target,
            -consts.ZOOM_FOR_ZOOM_BUTTONS
        );
    };

    private effectiveDistanceToSphere(boundingSphere: Sphere): number {
        const requiredDistance =
            (boundingSphere.radius / Math.tan(this.camera.zoom / 2)) * 10;
        return Math.abs(requiredDistance);
    }

    /**
     * This function tweens camera for the current position to the new position
     * Note: even though it does smooth camera movement and rotation,
     *       the actual movement trajectory in 3d space is linear.
     * @param position - final camera position
     * @param up       - final camera up position
     * @param target   - target you look at
     * @param easing   - function to make the animation smooth. See https://sole.github.io/tween.js/examples/03_graphs.html
     */
    public tweenCamera = (
        position: Vector3,
        up: Vector3,
        target: Vector3,
        easing: (amount: number) => number = Easing.Sinusoidal.InOut
    ) => {
        this.getControls().disable();
        new Tween(this.camera.position)
            .to(position)
            .easing(easing)
            .onStart(() => {
                new Tween(this.camera.up)
                    .to(up)
                    .easing(easing)
                    .onStart(() => {
                        new Tween(this.getControls().target)
                            .to(target)
                            .easing(easing)
                            .start();
                    })
                    .start();
            })
            .start();

        animate({
            timing: (t) => t,
            duration: 1000,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            draw: (_t) => {
                tween.update();
                // this.updateViewer();
                this.updateViewCube();
                this.updateTriad();
            },
        });
        this.getControls().enable();
    };

    // eslint-disable-next-line react/no-unused-class-component-methods
    public toggleViewCube = (cameraView: CameraView) => {
        // After 5 seconds of inactivity (no clicks), the animation function stops calling
        // WebGL rendering to free up CPU/GPU usage. A condition checks if the time since
        // the last mouse activity is more than 5 seconds and then stops calling the WebGL
        // rendering function. Because users may have an idle time of more than 5 seconds,
        // before they click on the view cube, we need to simulate a click on the canvas
        // to allow WebGL to trigger it's rendering function to update the camera position
        this.simulateCanvasClick();
        const boundingSphere = ((optBox: Box3 | null): Sphere => {
            if (optBox) {
                return optBox.getBoundingSphere(new Sphere());
            }

            return new Sphere(new Vector3(0, 0, -20), 30);
        })(this.maybeAllPartsBoundingBox());
        const distanceToTarget = this.effectiveDistanceToSphere(boundingSphere);
        cameraView.offset.multiplyScalar(this.camera.position.length());
        const targetPosition = new Vector3().copy(
            this.camera
                .getWorldDirection(new Vector3())
                .copy(cameraView.offset)
                .negate()
                .setLength(distanceToTarget)
                .add(boundingSphere.center)
        );

        this.tweenCamera(
            targetPosition,
            cameraView.up,
            boundingSphere.center,
            Easing.Sinusoidal.InOut
        );
    };

    public simulateCanvasClick = () => {
        const canvas: HTMLCanvasElement = this.getRendererDOMElement();

        // The simulated click will occur in the very top left corner so as not to
        // interact with the model or any other elements on the canvas
        const eventInitDict: MouseEventInit = {
            bubbles: true,
            cancelable: true,
            view: window,
            button: 0,
            buttons: 1,
            clientX: 0, // very top canvas corner
            clientY: 0, // very left canvas corner
        };

        // Simulate mousedown
        const mousedownEvent = new MouseEvent("mousedown", {
            ...eventInitDict,
        });
        canvas.dispatchEvent(mousedownEvent);

        // Simulate mouseup
        const mouseupEvent = new MouseEvent("mouseup", { ...eventInitDict });
        canvas.dispatchEvent(mouseupEvent);
    };

    public toggleObject = (objectName: string, isVisible: boolean): boolean => {
        this.simulateCanvasClick();
        if (objectName === "Blank") {
            this.isBlankVisible = isVisible;
        }

        if (!this.scene.children.length) {
            return false;
        }

        this.scene.children.forEach((obj) => {
            if (obj.name === objectName) {
                obj.visible = isVisible;
                return true;
            }
        });
        return false;
    };

    public handleEscape = (): void => {
        const { setLoadingModel } = this.props;

        this.angleArc!.visible = false;

        setLoadingModel(false);
    };

    /*
     * Handle Keyboard events and action
     */
    private handleViewerKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
        case "Escape":
            if (this.mouseDown) return;

            // eslint-disable-next-line react/destructuring-assignment
            this.props.setToolToDefault();
            this.handleEscape();

            break;
        case "Control":
            if (!this.orbitControls.enablePan)
                this.orbitControls.enablePan = true;
            break;
        default:
            break;
        }
    }

    public maybeAllPartsBoundingBox(): Box3 | null {
        const box = new Box3();

        this.getScene().children.forEach((obj) => {
            if (obj.name === "Gltf") {
                box.union(Utils3d.getAABBox(obj, true));
            }
        });

        return box.isEmpty() ? null : box;
    }

    public allPartsBoundingBox(): Box3 | null {
        const box = new Box3();

        this.getScene().children.forEach((obj) => {
            if (obj instanceof Object3D) {
                box.union(Utils3d.getAABBox(obj, true));
            }
        });

        return box.isEmpty() ? null : box;
    }

    // eslint-disable-next-line class-methods-use-this
    private getViewCubeElement(): HTMLDivElement {
        return document.getElementById(consts.VIEWCUBE_ID) as HTMLDivElement;
    }

    // eslint-disable-next-line class-methods-use-this
    public getRendererDOMElement(): HTMLCanvasElement {
        return document.getElementById(consts.CANVAS_ID) as HTMLCanvasElement;
    }

    // eslint-disable-next-line class-methods-use-this
    public getTriadRendererDOMElement(): HTMLCanvasElement {
        return document.getElementById(
            consts.TRIAD_CANVAS_ID
        ) as HTMLCanvasElement;
    }

    public getCamera(): OrthographicCamera {
        return this.camera;
    }

    public getControls(): OrbitControlsHelper {
        return this.orbitControls;
    }

    public getScene(): Scene {
        return this.scene;
    }

    public async loadModel(model: any, blankParams?: any) {
        await this.gltfLoader.loadModel(model);
        this.maybeZoomToFitObjects();
        this.addBlank(blankParams);
        this.triad.visible = true;
        this.triad.traverse((obj) => (obj.visible = true));
    }

    public maybeZoomToFitObjects() {
        const box = new Box3(new Vector3(), new Vector3());
        if (!this.scene.children.length) {
            return;
        }

        this.scene.children.forEach((obj) => {
            if (obj.name === "Gltf") {
                this.model = obj as Group;
                obj.visible = true;
                box.union(Utils3d.getAABBox(obj));
            }
        });

        this.cloneMaterialPerMesh();
        if (!box.isEmpty()) {
            this.zoomToFit(box);
        }
    }

    // eslint-disable-next-line react/no-unused-class-component-methods
    public getRenderer(): WebGLRenderer {
        return this.rendererHelper!;
    }

    public getGrid(): GridControlsHelper {
        return this.gridControlsHelper!;
    }

    public getRaycaster(): Raycaster {
        return this.raycaster;
    }

    public getMouse(): Vector2 {
        return this.mouse;
    }

    public getBackgroundPlane(): Mesh {
        return this.backgroundPlane;
    }

    private renderScene(scene: Scene, camera: Camera): void {
        this.rendererHelper!.render(scene, camera);
    }

    private renderTriadViewer(scene: Scene, camera: Camera): void {
        this.rendererHelper2!.render(scene, camera);
        this.labelRenderer.render(scene, camera);
    }

    private animate = () => {
        if (this.checkMouseInactivity()) {
            this.camera.updateProjectionMatrix();
            this.orbitControls.update();
            this.renderScene(this.scene, this.camera);
            this.renderTriadViewer(this.triadScene, this.triadCamera);
        }
        this.requestAnimationFrameId = requestAnimationFrame(
            this.animate.bind(this)
        );
    };

    public updateViewer(): void {
        this.camera.updateProjectionMatrix();
        this.orbitControls.update();
        if (this.rotationCenterFound === true) {
            this.renderScene(this.scene, this.camera);
            this.renderTriadViewer(this.triadScene, this.triadCamera);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onResize(_event?: Event): void {
        const columnsCount = this.props.frameSize!;
        const { frameSize = columnsCount } = this.props;

        const width =
            document.getElementById(consts.LABEL_CANVAS_ID)?.offsetWidth ??
            900;
        const height = document.getElementById(consts.LABEL_CANVAS_ID)?.offsetHeight ?? 600;
        this.rendererHelper!.setSize(
            (width / columnsCount) * frameSize,
            height
        );

        const aspect = ((width / columnsCount) * frameSize) / height;

        this.rendererHelper!.setViewport(0, 0, width, height);

        this.camera.left = -600 * aspect;
        this.camera.right = 600 * aspect;
        this.updateViewer();

        this.updateTriad();
        this.simulateCanvasClick();
    }

    private featureHighlight(
        event: MouseEvent,
        children?: THREE.Object3D<THREE.Event>[]
    ): void {
        if (this.props.featuresByAxes.length === 0) {
            return;
        }

        const rect = this.getRendererDOMElement().getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (!this.raycaster || !this.raycaster.params) {
            return;
        }
        //for thin lines
        this.raycaster!.params!.Line!.threshold = 0.1;

        const modelChildren = children ?? this.model?.children;
        if (!modelChildren) {
            return;
        }
        const intersects = this.raycaster.intersectObjects(modelChildren);

        if (intersects.length > 0) {
            if (this.intersected !== intersects[0].object) {
                const faceId =
                    this.intersected?.object?.userData["faceTopoId"] ?? "";
                const featureInfo = this.isAnyFeatureIdByFaceId(faceId);
                if (featureInfo.idx >= 0) {
                    this.highlightFeatures([], undefined, true);
                    this.highlightFeatures(featureInfo.faceIds);
                    store.dispatch(selectFeature(featureInfo.hash));
                }
                this.intersected = intersects[0];
            } else {
                this.intersected = null;
            }
        }
    }

    private isAnyFeatureIdByFaceId(faceId: any) {
        let idx = -1;
        const result = {
            idx: -1,
            hash: undefined as string | undefined,
            faceIds: [] as string[],
        };
        this.props.featuresByAxes?.forEach((featureAxis) => {
            featureAxis?.features?.forEach((rootObj) => {
                idx++;
                if ("propsHash" in rootObj) {
                    rootObj.features.forEach((subFeatures: IFeature) => {
                        if (
                            subFeatures?.feature?.featureFaceIds.includes(
                                faceId
                            )
                        ) {
                            result.idx = idx;
                            result.hash = subFeatures?.feature?.hash;
                            result.faceIds =
                                subFeatures?.feature?.featureFaceIds;
                        }
                        return;
                    });
                }

                const { feature } = rootObj as IFeature;
                if (feature?.featureFaceIds.includes(faceId)) {
                    result.idx = idx;
                    result.hash = feature?.hash;
                    result.faceIds = feature?.featureFaceIds;
                    return;
                }
            });
        });
        return result;
    }

    private onMouseMove(event: MouseEvent): void {
        // // setting the parameters to check mouse move Y direction
        // this.mouseDirectionY = this.mousePositionY - event.pageY;
        // this.mousePositionY = event.pageY;

        if (event.buttons === 2) {
            return;
        }

        if (
            this.rotationCenterFound &&
            this.mouseDown
            // this.props.selectedTool === TOOL_STATE.ROTATE_SCENE // "Rotate scene" for now, will be changed later to "Rotate"
        ) {
            this.getRendererDOMElement().style.cursor = rotateCursor;

            // get new mouse position

            const rect = this.getRendererDOMElement().getBoundingClientRect();
            this.rotateEnd.set(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
            this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart);

            // get mouse move vector
            const moveInMouseDirVec = new Vector3(0, 0, 0);
            moveInMouseDirVec.set(
                this.rotateDelta.x * -1,
                this.rotateDelta.y,
                0
            );
            const angle = moveInMouseDirVec.length();
            // const speedAdjustment = this.cameraOverPointRotationSpeed / 1000;
            const angleWithRotationSpeed =
                angle /
                (consts.ROTATION_ANGLE_ADJUSTMENT_COEFFICIENT /
                    // consts.CAMERA_OVER_POINT_ROTATION_SPEED); // will be back after testing is completed
                    // eslint-disable-next-line react/destructuring-assignment
                    this.props.rotationSpeed);
            const lookAtPoint = this.getControls().target;

            // move eye and target to origin
            const moveToFromOriginVec = new Vector3();

            moveToFromOriginVec.copy(this.rotationCenter!).negate();
            this.getCamera().position.add(moveToFromOriginVec);
            lookAtPoint.add(moveToFromOriginVec);

            // rotate
            // 1. find the rotation axis
            const rotationAxis = new Vector3();

            const mouseStart3D = new Vector3();
            mouseStart3D
                .set(this.rotateStart.x * -1, this.rotateStart.y, 0)
                .unproject(this.getCamera());
            const mouseEnd3D = new Vector3();
            mouseEnd3D
                .set(this.rotateEnd.x * -1, this.rotateEnd.y, 0)
                .unproject(this.getCamera());
            moveInMouseDirVec.subVectors(mouseEnd3D, mouseStart3D).normalize();
            const toEyeVec = new Vector3();
            toEyeVec.copy(this.getCamera().position).normalize();
            rotationAxis.crossVectors(toEyeVec, moveInMouseDirVec);
            rotationAxis.normalize();

            // 2. rotate
            // this.hideIntersectionPoint();
            // this.gridControlsHelper.visible = false;
            const quaternion = new Quaternion();
            quaternion.setFromAxisAngle(rotationAxis, angleWithRotationSpeed);
            this.getCamera().position.applyQuaternion(quaternion);
            this.getCamera().up.applyQuaternion(quaternion);
            lookAtPoint.applyQuaternion(quaternion);

            // move back to initial position
            moveToFromOriginVec.negate();
            this.getCamera().position.add(moveToFromOriginVec);
            lookAtPoint.add(moveToFromOriginVec);
            this.getCamera().lookAt(lookAtPoint);

            // update the scene
            // this.updateViewer();
            this.rotateStart.copy(this.rotateEnd);
        }
    }

    private onMouseDown(event: MouseEvent): void {
        this.lastMouseActivityTime = Date.now();
        const rect = this.getRendererDOMElement().getBoundingClientRect();
        if (
            event.button === consts.BUTTONS.LEFT ||
            event.button === consts.BUTTONS.MIDDLE ||
            event.button === consts.BUTTONS.RIGHT
        ) {
            this.mouseDown = true;
        }
        event.preventDefault();

        if (
            (event.button === consts.BUTTONS.MIDDLE && event.ctrlKey) ||
            event.button === consts.BUTTONS.RIGHT
        ) {
            this.orbitControls.enablePan = true;
            this.getRendererDOMElement().style.cursor = panCursor;
            this.windowSelectionTool.setStartPoint(
                event.clientX - rect.left,
                event.clientY - rect.top
            );
        } else {
            this.orbitControls.enablePan = false;
            this.featureHighlight(event);
        }

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.rotateStart.x = event.clientX - rect.left;
        this.rotateStart.y = event.clientY - rect.top;
        this.raycaster.setFromCamera(this.mouse, this.getCamera());

        this.rotationCenterFound = true;
        this.getControls().rotationPointFlag = true;

        const line = Utils3d.getCameraToPointerLineFromEvent(
            event,
            this.camera
        );

        this.rotationCenter = new Vector3().addVectors(
            this.camera.position,
            line
                .delta(new Vector3())
                .setLength(
                    this.camera.position.distanceTo(
                        this.maybeAllPartsBoundingBox()?.getCenter(
                            tempVector1
                        ) ?? tempVector1.set(0, 0, 0)
                    )
                )
        );
    }

    private onMouseUp(event: MouseEvent): void {
        this.lastMouseActivityTime = Date.now();
        event.preventDefault();

        if (this.mouseDown || this.orbitControls.enablePan) {
            this.getRendererDOMElement().style.cursor = "auto";
        }

        if (this.angleArc) {
            this.angleArc.visible = false;
        }

        this.mouseDown = false;
        // this.gridControlsHelper.visible = true;

        const { selectedTool } = this.props;

        if (selectedTool === TOOL_STATE.NAVIGATE) {
            this.orbitControls.enableRotate = true;
            if (event.button === consts.BUTTONS.MIDDLE) {
                this.orbitControls.enablePan = true;
            }
        }

        if (
            selectedTool === TOOL_STATE.PAN &&
            event.button !== consts.BUTTONS.MIDDLE
        ) {
            this.orbitControls.enablePan = true;
        }

        if (!this.rotationCenterFound) {
            return;
        }

        this.rotationCenterFound = false;
        this.getControls().rotationPointFlag = false;
    }

    private cloneMaterial(mesh: any): void {
        if (!mesh.material) {
            return;
        }

        if (!mesh.userData.originalColor) {
            mesh.userData = {
                ...mesh.userData,
                originalColor: mesh.material.color.clone(),
            };
        }

        mesh.material = mesh.material.clone();
    }

    public cloneMaterialPerMesh(
        children?: THREE.Object3D<THREE.Event>[]
    ): void {
        const modelChildren = children ?? this.model?.children;
        modelChildren?.forEach((mesh) => {
            if (mesh.children) {
                this.cloneMaterialPerMesh(mesh.children);
            }
            this.cloneMaterial(mesh);
        });
    }

    private highlightMesh(mesh: any, color?: Color): void {
        if (!mesh.material) {
            return;
        }

        if (color) {
            mesh.material.color.set(color);
        } else if (mesh.userData.originalColor) {
            mesh.material.color.set(mesh.userData.originalColor);
        }
    }

    public highlightFeatures(
        ids: any[],
        children?: THREE.Object3D<THREE.Event>[],
        resetHighlight?: boolean
    ): void {
        const hexColor = stc(ids.join(""));
        const color = new THREE.Color(hexColor);
        //color.setHex(Math.floor(Math.random() * (0xffffff + 1)));

        const modelChildren = children ?? this.model?.children;
        modelChildren?.forEach((mesh) => {
            if (mesh.children) {
                this.highlightFeatures(ids, mesh.children);
            }

            if (ids.length === 0 || resetHighlight) {
                this.highlightMesh(mesh);
            } else if (ids.includes(mesh.userData.faceTopoId)) {
                this.highlightMesh(mesh, color);
            }
        });
    }

    public onPointerMove(event: MouseEvent): void {
        event.preventDefault();

        const rect = this.getRendererDOMElement().getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        if (this.raycaster?.params?.Line?.threshold) {
            this.raycaster.params.Line.threshold = 0.1;
        }

        if (!this.model) {
            return;
        }

        const intersects = this.raycaster.intersectObjects(this.model.children);

        if (intersects.length > 0) {
            if (this.intersected !== intersects[0].object) {
                if (this.intersected) {
                    this.highlightMesh(this.intersected.object);
                }
                // eslint-disable-next-line prefer-destructuring
                this.intersected = intersects[0];
                const color = new THREE.Color("white");
                color.setHex(Math.floor(Math.random() * (0xffffff + 1)));
                this.highlightMesh(this.intersected.object, color);
            }
        } else {
            if (this.intersected) {
                this.highlightMesh(this.intersected.object);
            }
            this.intersected = null;
        }
    }

    public addBlank(params?: any) {
        this.isBlankVisible = false;
        const resizeParams = {
            beforeX: 0,
            afterX: 0,
            beforeY: 0,
            afterY: 0,
            beforeZ: 0,
            afterZ: 0,
        };
        this.resizeBlank(params ?? resizeParams);
    }

    public resizeBlank(params?: any) {
        const scaleFactor = 100;
        const {
            beforeX = 0,
            afterX = 0,
            beforeY = 0,
            afterY = 0,
            beforeZ = 0,
            afterZ = 0,
        } = params ?? {};
        this.scene.children.forEach((obj) => {
            if (obj.name === "Blank") {
                this.scene.remove(obj);
            }
        });

        const model = this.scene.children.find((obj) => obj.name === "Gltf");
        if (!model) {
            return;
        }

        const boundingBox = this.maybeAllPartsBoundingBox();
        const measure = new THREE.Vector3();
        const box = boundingBox?.getSize(measure);

        if (!boundingBox || !box) {
            return;
        }

        const newWidth = box.x + (beforeX * scaleFactor + afterX * scaleFactor);
        const newHeight =
            box.y + (beforeY * scaleFactor + afterY * scaleFactor);
        const newDepth = box.z + (beforeZ * scaleFactor + afterZ * scaleFactor);

        const boxDummyGeo = new THREE.BoxBufferGeometry(
            newWidth,
            newHeight,
            newDepth
        );

        const matrix = new THREE.Matrix4().setPosition(
            new THREE.Vector3()
                .addVectors(boundingBox.min, boundingBox.max)
                .multiplyScalar(0.5)
        );
        boxDummyGeo.applyMatrix4(matrix);

        const material = new THREE.MeshBasicMaterial({
            color: 0xf5f6f5,
            opacity: 0.8,
            transparent: true,
        });
        const cube = new THREE.Mesh(boxDummyGeo, material);
        cube.name = "Blank";

        cube.position.setX(
            model.position.x -
                (beforeX * scaleFactor) / 2 +
                (afterX * scaleFactor) / 2
        );
        cube.position.setY(
            model.position.y -
                (beforeY * scaleFactor) / 2 +
                (afterY * scaleFactor) / 2
        );
        cube.position.setZ(
            model.position.z -
                (beforeZ * scaleFactor) / 2 +
                (afterZ * scaleFactor) / 2
        );

        this.scene.add(cube);

        this.toggleObject("Blank", this.isBlankVisible);
    }

    // eslint-disable-next-line react/sort-comp, no-use-before-define
    private static _instance: Viewer;

    public static get instance(): Viewer {
        // eslint-disable-next-line no-underscore-dangle
        return Viewer._instance;
    }

    public checkMouseInactivity = (): boolean => {
        const currentTime = Date.now();
        const timeSinceLastActivity = currentTime - this.lastMouseActivityTime;

        // if timeSinceLastActivity > 5 seconds or the user does not press the mouse button -
        // the entire requestAnimationFrame should not be called to free up GPU usage.
        return (
            !(timeSinceLastActivity >= this.inactivityThreshold) ||
            this.mouseDown
        );
    };

    render() {
        return (
            <div className="h-full" id={consts.LABEL_CANVAS_ID}>
                <canvas id={consts.CANVAS_ID} className="canvasViewer" />
                <canvas
                    id={consts.TRIAD_CANVAS_ID}
                    className="canvasViewer"
                    style={{ ...(triadCanvasStyle as any) }}
                />
            </div>
        );
    }
}

export default Viewer;
