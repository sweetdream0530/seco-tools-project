/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as THREE from "three";
import { Vector3 } from "three";
import Viewer from "../Viewer";
import consts from "../consts";
import { areEqual } from "~/utils/utils3d";

export default class GridControlsHelper extends THREE.Group {
    viewer: Viewer;

    mainGrid!: THREE.GridHelper;

    subGrid!: THREE.GridHelper;

    gridPlane!: THREE.Mesh;

    private geometry: THREE.BufferGeometry = null!;

    private material: THREE.LineBasicMaterial = null!;

    private size: number = null!;

    private divisions: number = null!;

    public readonly cellSize: number;

    public readonly subcellSize: number;

    public readonly divisionsPerCell: number;

    constructor(
        viewer: Viewer,
        size: number,
        cellSize: number = consts.DEFAULT_GRID_CELL_SIZE,
        divisionsPerCell: number = consts.DEFAULT_GRID_DIVISIONS_PER_CELL,
    ) {
        super();
        this.viewer = viewer;
        this.cellSize = cellSize;
        this.divisionsPerCell = divisionsPerCell;
        this.subcellSize = cellSize / divisionsPerCell;
        this.buildGrid(size);

        this.rotateX(Math.PI / 2);
    }

    public dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }

    buildGrid(gridSize: number) {
        const color1 = consts.DEFAULT_GRID_MAJOR_COLOR;
        const color2 = consts.DEFAULT_GRID_MINOR_COLOR;

        const bigDivisions = Math.ceil(gridSize / (2 * this.cellSize));
        this.size = bigDivisions * this.cellSize * 2;
        this.divisions = Math.ceil(this.size / (2 * this.subcellSize));
        const opacity = 0.3;
        this.geometry = new THREE.BufferGeometry();

        this.material = new THREE.LineBasicMaterial({
            vertexColors: true,
        });

        this.setPositionAttribute();
        this.setColorAttribute(color2, color1, this.size);

        this.material.transparent = true;
        this.material.opacity = opacity;

        this.add(new THREE.LineSegments(this.geometry, this.material));

        this.mainGrid = new THREE.GridHelper(
            this.size,
            2,
            consts.DEFAULT_SUBGRID_COLOR,
            "lightgrey",
        );

        const geometry = new THREE.PlaneGeometry(this.size, this.size);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
        });
        planeMaterial.transparent = true;
        planeMaterial.opacity = 0.1;
        this.gridPlane = new THREE.Mesh(geometry, planeMaterial);
        this.gridPlane.rotateX(Math.PI / 2);

        this.add(this.gridPlane);
        this.add(this.mainGrid);

        // Buildplane must be rendered last; otherwise, the parts displayed may overlap if the camera is on the back of the Buildplane.
        this.renderOrder = consts.BUILD_PLANE_RENDER_ORDER;
    }

    public setColorAttribute(
        minorLineColor: number,
        majorLineColor: number,
        gridSize: number,
    ) {
        const minorColor = new THREE.Color(minorLineColor);
        const majorColor = new THREE.Color(majorLineColor);

        const step = this.size / this.divisions;
        const halfSize = gridSize / 2;
        const colors: Array<number> = [];

        const subcellsCount = this.size / this.subcellSize;

        for (
            let i = 0, j = 0, k = -halfSize;
            i <= subcellsCount;
            i += 1, k += step
        ) {
            let color = i % this.divisionsPerCell ? minorColor : majorColor;
            if (i % (subcellsCount / 2) === 0) {
                color = new THREE.Color(consts.DEFAULT_SUBGRID_COLOR);
            }

            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }

        this.geometry.deleteAttribute("color");
        this.geometry.setAttribute(
            "color",
            new THREE.Float32BufferAttribute(colors, 3),
        );
    }

    private setPositionAttribute() {
        const step = this.subcellSize;
        const halfSize = this.size / 2;
        const vertices = [];

        for (
            let i = 0, k = -halfSize;
            i <= this.size / this.subcellSize;
            i += 1, k += step
        ) {
            vertices.push(-halfSize, 0, k, halfSize, 0, k);
            vertices.push(k, 0, -halfSize, k, 0, halfSize);
        }
        this.geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(vertices, 3),
        );
    }

    public setBuildPlaneSize(offset: number) {
        if (offset <= consts.DEFAULT_GRID_SIZE / 2 - consts.DEFAULT_GRID_CELL_SIZE) return;

        // TODO: this might be a bug
        // eslint-disable-next-line no-unused-expressions
        this.dispose;

        [...this.children].forEach((child) => this.remove(child));
        this.remove(this.gridPlane);

        this.buildGrid(offset * 2);
    }

    public setBuildPlaneVerticalPosition(coordinateZ: number) {
        if (areEqual(this.position.z, coordinateZ)) return;

        this.position.setZ(coordinateZ);
    }

    public getGridCurrentPosition(): Vector3 {
        return this.position;
    }
}
