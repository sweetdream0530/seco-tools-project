import { MS_IN_SECOND } from "./consts";

export default class FpsCounter {
    private cycleStart: number = performance.now();

    private updateOnEveryNthFrame: number;

    private _fps!: number;

    private ticksInCycle = 0;

    public onFpsUpdated: (fps: number) => void;

    public get fps() {
    // eslint-disable-next-line no-underscore-dangle
        return this._fps;
    }

    public constructor(
        onFpsUpdated: (fps: number) => void,
        updateOnEveryNthFrame = 5,
    ) {
        this.onFpsUpdated = onFpsUpdated;
        this.updateOnEveryNthFrame = updateOnEveryNthFrame;
    }

    public tick() {
        if (this.ticksInCycle % this.updateOnEveryNthFrame === 0) {
            const time = performance.now();
            const timeForCycle = time - this.cycleStart;
            // eslint-disable-next-line no-underscore-dangle
            this._fps = this.updateOnEveryNthFrame / (timeForCycle / MS_IN_SECOND);
            this.cycleStart = time;
            // eslint-disable-next-line no-underscore-dangle
            this.onFpsUpdated(this._fps);
            this.ticksInCycle = 0;
        }

        this.ticksInCycle += 1;
    }
}
