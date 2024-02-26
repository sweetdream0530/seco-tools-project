import * as THREE from "three";
import consts from "../consts";

export default class LightsHelper {
    private _lights: THREE.Light[] = [];

    constructor() {
    // eslint-disable-next-line no-underscore-dangle
        this._lights.push(new THREE.AmbientLight(consts.LIGHT_COLOR, 0.35));

        const hemisphereLight = new THREE.HemisphereLight(
            consts.LIGHT_COLOR,
            consts.LIGHT_COLOR,
            0.15,
        );
        hemisphereLight.position.set(-200, -200, -50);
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(hemisphereLight);

        const directionalLight = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.25,
        );
        directionalLight.position.set(200, 200, -100);
        directionalLight.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight);

        const directionalLight1 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );
        directionalLight1.position.set(200, 0, -20);
        directionalLight1.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );

        directionalLight2.position.set(-200, 0, -20);
        directionalLight2.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight2);

        const directionalLight3 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );

        directionalLight3.position.set(0, -200, -20);
        directionalLight3.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight3);

        const directionalLight4 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );

        directionalLight4.position.set(0, 200, -20);
        directionalLight4.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight4);

        const directionalLight5 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );
        directionalLight5.position.set(-100, 200, 200);
        directionalLight5.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight5);

        const directionalLight6 = new THREE.DirectionalLight(
            consts.LIGHT_COLOR,
            0.15,
        );

        directionalLight6.position.set(-200, -200, 200);
        directionalLight6.castShadow = true;
        // eslint-disable-next-line no-underscore-dangle
        this._lights.push(directionalLight6);
    }

    public get lights() {
    // eslint-disable-next-line no-underscore-dangle
        return this._lights;
    }
}
