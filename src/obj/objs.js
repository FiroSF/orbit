"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ship = exports.MovingPlanet = exports.SolidPlanet = void 0;
const objBase_1 = require("./objBase");
class SolidPlanet extends objBase_1.Obj {
    constructor(x, y, g = 100000) {
        super(x, y, g);
    }
    posCalc() { }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'orange';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);
            // console.log(this.x, this.y);
            this.isModified = false;
        }
    }
}
exports.SolidPlanet = SolidPlanet;
class MovingPlanet extends objBase_1.MovingObj {
    constructor(x, y, g = 100000, vx = 0, vy = 0) {
        super(x, y, g, vx, vy);
    }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 255, 0)';
            ctx.fillRect(this.x - this.g / 20000, this.y - this.g / 20000, this.g / 10000, this.g / 10000);
            this.isModified = false;
        }
    }
}
exports.MovingPlanet = MovingPlanet;
class Ship extends objBase_1.MovingObj {
    constructor(x, y, vx, vy) {
        super(x, y, 0, vx, vy);
    }
    renderCalc(dt, ctx) {
        if (this.isModified) {
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(this.x, this.y, 3, 3);
            this.isModified = false;
        }
    }
}
exports.Ship = Ship;
