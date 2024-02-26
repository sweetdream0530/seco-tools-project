import { OrbitControls } from "../controls/OrbitControls";

export default class OrbitControlsHelper extends OrbitControls {
    public enable() {
        this.enabled = true;
    }

    public disable() {
        this.enabled = false;
    }
}
