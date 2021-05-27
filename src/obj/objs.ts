import { Obj, MovingObj } from './objBase';

export interface Planet extends Obj {}

export class SolidPlanet extends Obj implements Planet {
    constructor(x: number, y: number, g: number = 100000) {
        super(x, y, g);
    }

    posCalc() {}

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        if (this.isModified) {
            ctx.fillStyle = 'orange';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);
            // console.log(this.x, this.y);

            this.isModified = false;
        }
    }
}

export class MovingPlanet extends MovingObj implements Planet {
    constructor(x: number, y: number, g: number = 100000, vx: number = 0, vy: number = 0) {
        super(x, y, g, vx, vy);
    }

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);

            this.isModified = false;
        }
    }
}

export class Ship extends MovingObj {
    constructor(x: number, y: number, vx: number, vy: number) {
        super(x, y, 0, vx, vy);
    }

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(this.x, this.y, 3, 3);

            this.isModified = false;
        }
    }
}
