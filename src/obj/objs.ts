import { Obj, MovingObj, Footprint } from './objBase';
import { CONSTANTS } from '../static/constants';

export interface Planet extends Obj {}

export class SolidPlanet extends Obj implements Planet {
    constructor(x: number, y: number, g: number = 100000) {
        super(x, y, g);
    }

    posCalc() {}

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.g ** 0.5 / 5);
        radgrad.addColorStop(0, '#000000');
        radgrad.addColorStop(0.1, '#000000');
        radgrad.addColorStop(0.1, '#E7AC0C');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);

        this.isModified = false;
    }
}

export class SolidInvertedPlanet extends SolidPlanet {
    constructor(x: number, y: number, g: number = 100000) {
        super(x, y, -g);
    }

    posCalc() {}

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, (0 - this.g) ** 0.5 / 5);
        radgrad.addColorStop(0, '#000000');
        radgrad.addColorStop(0.1, '#000000');
        radgrad.addColorStop(0.1, '#1853F3');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
        // console.log(this.x, this.y);
    }
}

export class MovingPlanet extends MovingObj implements Planet {
    constructor(x: number, y: number, g: number = 100000, vx: number = 0, vy: number = 0) {
        super(x, y, g, vx, vy);
    }

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        var radgrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.g ** 0.5 / 5);
        radgrad.addColorStop(0, '#000000');
        radgrad.addColorStop(0.1, '#000000');
        radgrad.addColorStop(0.1, '#A7D30C');
        radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = radgrad;
        ctx.fillRect(0, 0, 100000, 100000);
    }
}

export class Ship extends MovingObj {
    constructor(x: number, y: number, vx: number, vy: number) {
        super(x, y, 0, vx, vy);
    }

    renderCalc(dt: number, ctx: CanvasRenderingContext2D) {
        if (this.isModified) {
            var rectangle = new Footprint();
            rectangle.rect(this.x, this.y, 3, 3);
            this.footprints.push(rectangle);

            this.isModified = false;
        }

        while (1) {
            // console.log(this.footprints[0]);
            if (this.footprints.length != 0 && this.footprints[0].createdDate + CONSTANTS.FOOTPRINT_LIFE_TIME < Date.now()) {
                this.footprints.shift();
            } else {
                break;
            }
        }
        ctx.fillStyle = 'rgb(0, 0, 0)';
        // console.log(this.footprints);
        this.footprints.forEach((f) => {
            ctx.fill(f);
        });
    }
}
