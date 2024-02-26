/* eslint-disable no-param-reassign */
import THREE, { Mesh, Scene, Vector3 } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Camera from "./Camera.3d";
import { store } from "~/store";
import { setModelSize } from "~/store/model/actions";
import { GLTFLoader } from "./GltfLoader.extended";

const roundToZero = (vector: Vector3, digits: number):Vector3 => {
    const e = Math.pow(10, digits || 0);

    vector.x = vector.x < 0 ? Math.ceil(vector.x * e) / e : Math.floor(vector.x * e) / e;
    vector.y = vector.y < 0 ? Math.ceil(vector.y * e) / e : Math.floor(vector.y * e) / e;
    vector.z = vector.z < 0 ? Math.ceil(vector.z * e) / e : Math.floor(vector.z * e) / e;

    return vector;
};

const multiplier = 100;

export default class GltfLoaderService {
    private scene: Scene;

    private camera: Camera;

    constructor(scene: Scene, camera: Camera) {
        this.scene = scene;
        this.camera = camera;
    }

    public loadModel(selectedFile: any) {
        return new Promise((resolve, reject) => {
            if (!selectedFile) {
                reject(false);
            }

            const { scene } = this;
            this.scene.children.forEach((obj) => {
                if (obj.name === "Gltf") {
                    this.scene.remove(obj);
                }
            });
            this.scene.children.forEach((obj) => {
                if (obj.name === "Blank") {
                    this.scene.remove(obj);
                }
            });

            // Instantiate a loader
            const loader = new GLTFLoader();

            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
            loader.setDRACOLoader(dracoLoader);
            // Load a glTF resource
            loader.parse(
                // resource URL
                selectedFile,
                "",
                // called when the resource is loaded
                (gltf: any) => {
                    gltf.scene.name = "Gltf";
          
                    gltf.scene.scale.set(multiplier * gltf.scene.scale.x, multiplier * gltf.scene.scale.y, multiplier * gltf.scene.scale.z);
                    gltf.scene.rotateX(Math.PI / 2);
                    scene.add(gltf.scene);

                    const boundingBox = new THREE.Box3();
                    boundingBox.setFromObject(gltf.scene.children[0]);
                    const size = boundingBox.max.clone().sub(boundingBox.min);

                    store.dispatch(setModelSize(roundToZero(size, 3)));

                    const group = gltf.scene.children[0];

                    group.children.forEach((mesh: Mesh) => {
                        const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry, 40);
                        const colors = [];
                        const edgesCount = edgesGeometry?.attributes?.position?.count ?? 0;
                        for (let i = 0; i < edgesCount; i++) {
                            colors.push(0, 0, 0);
                        }
                        edgesGeometry.setAttribute(
                            "color",
                            new THREE.Float32BufferAttribute(colors, 3)
                        );
                        const edgesMaterial = new THREE.LineBasicMaterial({
                            vertexColors: true
                        });

                        const line = new THREE.LineSegments(edgesGeometry, edgesMaterial);
            
                        mesh.add(line);
  
                    });
                    resolve("ok");
                },
            );
        });
    }
}