import { MS_IN_SECOND } from "./consts";

export default class Logger {
    private framesPerPeriod: number[] = [1];

    private periodLength: number;

    private currentPeriodNumber = 0;

    private start!: number;

    public constructor(periodLength = 1) {
        this.periodLength = periodLength;
    }

    public tick() {
        if (!this.start) {
            this.start = performance.now();
            return;
        }
        const period = Math.floor(
            (performance.now() - this.start) / (this.periodLength * MS_IN_SECOND),
        );
        if (period === this.currentPeriodNumber) {
            this.framesPerPeriod[this.framesPerPeriod.length - 1] += 1;
        } else {
            this.currentPeriodNumber += 1;
            this.framesPerPeriod.push(1);
        }
    }

    public showStats() {
        let average = 0;
        for (let i = 0; i < this.framesPerPeriod.length; i += 1) {
            const fps = this.framesPerPeriod[i] / this.periodLength;
            console.log(`${(i + 1) * this.periodLength}s: ${Math.round(fps)} fps`);
            average += fps / this.framesPerPeriod.length;
        }
        console.log("--------");
        console.log(`Average: ${Math.round(average)} fps`);
    }
}
